"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");

    extensionService.use({
      resolversConfig: {
        "Query.userProfiles": {
          middlewares: [
            async (next, parent, args, context, info) => {
              // Useful for getting the information required to build this middleware
              // console.log("Args:", JSON.stringify(args, null, 4));
              // console.log("Context:", context);

              // Extract the user from the context
              const { user } = context.state;

              // If no user we are throwing an error
              if (!user) {
                throw new Error("Authentication requested");
              }

              // Construct your default filters
              const filters = {
                user: {
                  id: {
                    eq: user.id,
                  },
                },
              };

              // This logic is extremely subjective to use-case and what filters you use
              // This is just a quick example on force setting filters and/or merging filters
              if (!args.filters) {
                args.filters = filters;
              } else if (args.filters.user) {
                args.filters.user = filters.user;
              } else {
                args.filters = {
                  and: [args.filters, filters],
                };
              }

              // Logging to show difference from specified filters vs default filters
              console.log(JSON.stringify(args, null, 4));

              // Let request continue
              return next(parent, args, context, info);
            },
          ],
        },
      },
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
