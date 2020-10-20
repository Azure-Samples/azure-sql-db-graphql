using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;
using HotChocolate.Execution.Instrumentation;
using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DiagnosticAdapter;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using HotChocolate.Resolvers;
using Microsoft.Extensions.Logging;

namespace sqldb_graphql
{
    public class Startup
    {
        public static readonly ILoggerFactory loggerFactory
            = LoggerFactory.Create(builder => { builder.AddConsole(); });

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<WwiContext>(options =>
                options
                .UseLoggerFactory(loggerFactory)
                .EnableSensitiveDataLogging()
                .UseSqlServer(Configuration.GetConnectionString("wwidatabase")));            

            services.AddLogging();

            //services.AddDiagnosticObserver<DiagnosticObserver>();

            services.AddGraphQL( sp =>
                SchemaBuilder.New()
                    .AddQueryType<OrderQueriesType>()
                    .AddServices(sp)
                    .Create(),
                new QueryExecutionOptions { ForceSerialExecution = true });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app
            .UseRouting()
            .UseWebSockets()
            .UseGraphQL()
            .UsePlayground();
        }
    }
}

    public class DiagnosticObserver
        : IDiagnosticObserver
    {
        private readonly ILogger _logger;
        public DiagnosticObserver(ILogger<DiagnosticObserver> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [DiagnosticName("HotChocolate.Execution.Query")]
        public void OnQuery(IQueryContext context)
        {
            // This method is used as marker to enable begin and end events 
            // in the case that you want to explicitly track the start and the 
            // end of this event.
        }

        [DiagnosticName("HotChocolate.Execution.Query.Start")]
        public void BeginQueryExecute(IQueryContext context)
        {
            _logger.LogInformation(context.Request.Query.ToString());
        }

        [DiagnosticName("HotChocolate.Execution.Query.Stop")]
        public void EndQueryExecute(IQueryContext context)
        {
            using (var stream = new MemoryStream())
            {
                var resultSerializer = new JsonQueryResultSerializer();
                var str = resultSerializer.Serialize(
                    (IReadOnlyQueryResult)context.Result);
                _logger.LogInformation(str,null);
            }
        }

        [DiagnosticName("HotChocolate.Execution.Resolver.Error")]
        public void OnResolverError(
            IResolverContext context,
            IEnumerable<IError> errors)
        {
            foreach (IError error in errors)
            {
                string path = string.Join("/",
                    error.Path.Select(t => t.ToString()));

                if (error.Exception == null)
                {
                    _logger.LogError("{0}\r\n{1}", path, error.Message);
                }
                else
                {
                    _logger.LogError(error.Exception,
                        "{0}\r\n{1}", path, error.Message);
                }
            }
        }
    }