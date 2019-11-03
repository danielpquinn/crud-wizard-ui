export const content = `
Crud wizard uses OpenAPI specifications to render **create**, **read**, **update** and **delete** UI for resources defined by its users. It is similar to [Swagger UI](https://swagger.io/tools/swagger-ui/), but generates a fully functional admin UI instead of indivudual forms for each operation. Think [KeystoneJS](https://keystonejs.com/) admin UI, or [django](https://www.djangoproject.com/) admin. The admin UI generated by crud wizard consists of the following components:

* Navigation panel
* Create window
* List window
* Detail window
* Update window

## Use Cases

#### Development Tool

Crud wizard projects can be used alongside other tools like Postman or Swagger UI to give developers quick access to their API without having to spend time manually crafting calls to backend services. While Swagger UI provides fine-grained access to each operation in the spec, crud wizard provides a configurable dashboard that makes managing resources exposed by APIs more convenient.

#### Internal Admin UI

If you are building a product or service that epxoses an API but doesn't need a user interface, you can use crud wizard to automatically generate an admin UI for you. Popular examples of this type of product include [Twilio](https://www.twilio.com/) and [Stripe](https://stripe.com/). When these types of companies are just getting started, they may not have the time or resources to build a polished user interface for their backend API, but still need some way to browse and manage resources using a GUI. Instead of hiring a frontend developer or spending time setting up tools that need to be built and deployed manually, they can use crud wizard to generate an Admin UI that covers 80% of their needs without having to change any of their existing code.
`;