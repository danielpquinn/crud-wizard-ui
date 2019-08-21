import * as React from "react";
import { DocsLayout } from "src/pages/docs/DocsLayout";

export class IntroductionDoc extends React.Component<{}, {}> {

  public render() {
    return (
      <DocsLayout>

      <div className="docs">
              <div className="page-wrapper">
              <header id="header" className="header">
                  <div className="container">
                      <div className="branding">
                          <h1 className="logo">
                              <a href="index.html">
                                  <span aria-hidden="true" className="icon_documents_alt icon"/>
                                  <span className="text-highlight">Pretty</span><span className="text-bold"/>
                              </a>
                          </h1>
                      </div>
                      <ol className="breadcrumb">
                          <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                          <li className="breadcrumb-item active">FAQs</li>
                      </ol>
                      <div className="top-search-box">
                        <form className="form-inline search-form justify-content-center" action="" method="get">

                        <input type="text" placeholder="Search..." name="search" className="form-control search-input"/>

                        <button type="submit" className="btn search-btn" value="Search"><i className="fas fa-search"/></button>

                    </form>
                      </div>
                  </div>
              </header>
              <div className="doc-wrapper">
                  <div className="container">
                      <div id="doc-header" className="doc-header text-center">
                          <h1 className="doc-title"><span aria-hidden="true" className="icon icon_lifesaver"/> FAQs YO</h1>
                          <div className="meta"><i className="far fa-clock"/> Last updated: July 18th, 2018</div>
                      </div>
                      <div className="doc-body row">
                          <div className="doc-content col-md-9 col-12 order-1">
                              <div className="content-inner">
                                  <section id="general" className="doc-section">
                                      <h2 className="section-title">General 12345</h2>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Can I viverra sit amet quam eget lacinia?</h3>
                                          <div className="answer">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> What is the ipsum dolor sit amet quam tortor? <span className="badge badge-success">New</span></h3>
                                          <div className="answer">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> How does the morbi quam tortor work?</h3>
                                          <div className="answer">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis. Vestibulum vitae justo quam. Nulla luctus nunc in neque suscipit dictum. Cras faucibus magna sem, non accumsan quam interdum elementum. Pellentesque sollicitudin orci mauris, sit amet mollis nisi vehicula ut. Fusce non accumsan massa, tempus dictum leo. Suspendisse ornare ex vel imperdiet cursus.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> How does the morbi quam tortor work? <span className="label label-warning">Updated</span></h3>
                                          <div className="answer">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> How do I submit gravida justo ut sem feugiat?</h3>
                                          <div className="answer">Quisque rhoncus elit in ullamcorper finibus. Mauris diam ipsum, tristique id nibh at, sagittis suscipit odio. Donec lacinia consequat augue vulputate pellentesque. Donec sed vehicula purus. Aliquam ac enim non magna vulputate mattis. Proin non vulputate est, id aliquam tortor. </div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Are there any gravida justo ut sem feugiat?</h3>
                                          <div className="answer">Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum est a lacus semper porta. Pellentesque nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                                      </div>
                                  </section>

                                  <section id="features" className="doc-section">
                                      <h2 className="section-title">Features</h2>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Why am I getting congue condimentum turpis?</h3>
                                          <div className="answer">
                                              <p>Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum est a lacus semper porta. Pellentesque nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                              <pre><code className="language-python">class label: pass  # declare a label

      try:
          ...
          if condition: raise label()  # goto label
          ...
      except label:  # where to goto
          pass
      ...</code></pre>
                                              <p>Duis ligula ante, lobortis pretium maximus ut, mattis quis augue. Curabitur vel posuere lorem, sit amet consectetur orci. Sed mollis eget nisi eu aliquam.</p>
                                          </div>

                                          <div className="section-block">
                                              <h3 className="question"><i className="fas fa-question-circle"/> How are gravida implemented?</h3>
                                              <div className="answer">
                                                  <p>Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum est a lacus semper porta. Pellentesque nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>


                                                  </div>
                                          </div>

                                          <div className="section-block">
                                              <h3 className="question"><i className="fas fa-question-circle"/> How does vehicula manage congue tortor?</h3>
                                              <div className="answer">Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum <code>&#x3C;div&#x3E;...&#x3C;/div&#x3E;</code> est a lacus semper porta. Pellentesque nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                                          </div>

                                          <div className="section-block">
                                              <h3 className="question"><i className="fas fa-question-circle"/> Why does vehicula manage congue tortor?</h3>
                                              <div className="answer">Aliquam a dui turpis. In vel tellus eget erat ullamcorper egestas at et lectus. Fusce a consectetur nisi, malesuada volutpat tellus. Nam ut urna nec urna dictum dictum sagittis id lacus. Aliquam auctor dapibus est, sit amet vehicula purus sollicitudin a. Morbi pulvinar euismod quam et aliquam. In hac habitasse platea dictumst. Quisque vel euismod sem, sit amet viverra justo.</div>
                                          </div>

                                          <div className="section-block">
                                              <h3 className="question"><i className="fas fa-question-circle"/> Why does vehicula manage congue tortor?</h3>
                                              <div className="answer">Quisque dignissim, lectus ac pretium dapibus, nunc arcu ornare nunc, et aliquam odio augue vitae eros. Cras vel risus quam. Aenean ultricies molestie purus bibendum lobortis. Curabitur vehicula, nisi ut tincidunt consequat, augue mi volutpat nisl, id posuere felis lectus quis quam. Donec at eros consequat, cursus eros eget, ornare mauris. Proin semper tincidunt dapibus. Etiam ornare, nibh eu dapibus pellentesque, magna metus dapibus neque, euismod fringilla nulla orci eu dolor. Mauris convallis rutrum efficitur. Integer sagittis nisi in ante convallis tempor. In placerat, velit quis laoreet sollicitudin, massa est sagittis massa, quis viverra diam nibh vitae sapien. Nunc facilisis nisl non condimentum pretium. Duis nec metus venenatis, hendrerit nisi maximus, consequat erat. Morbi odio mauris, aliquam eu bibendum vel, pulvinar at sem. Nunc sit amet elementum nisl, ac malesuada nibh. Vestibulum imperdiet dui non venenatis bibendum.</div>
                                          </div>


                                      </div>
                                  </section>

                                  <section id="pricing" className="doc-section">
                                      <h2 className="section-title">Pricing</h2>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> How much is magna at posuere? <span className="label label-success">New</span></h3>
                                          <div className="answer">Curabitur nec ipsum placerat, accumsan justo eu, imperdiet augue. Praesent eget mattis erat. Donec dolor odio, maximus quis est ut, bibendum pharetra ante. Sed faucibus nec dui sed elementum. Nullam aliquet, dui at bibendum egestas, lorem metus euismod libero, ut porta risus felis eget odio. Aenean tincidunt magna at posuere semper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Can I risus felis eget odio?</h3>
                                          <div className="answer">Curabitur nec ipsum placerat, accumsan justo eu, imperdiet augue. Praesent eget mattis erat. Donec dolor odio, maximus quis est ut, bibendum pharetra ante. Sed faucibus nec dui sed elementum. Nullam aliquet, dui at bibendum egestas, lorem metus euismod libero, ut porta risus felis eget odio. Aenean tincidunt magna at posuere semper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Can I purus lobortis nibh?</h3>
                                          <div className="answer">Ut cursus, felis vel vulputate dictum, nisi mauris aliquam mi, sed venenatis leo sem eu diam. Etiam pulvinar aliquet eros, vitae consequat ex consectetur eu. Nulla non purus a orci volutpat scelerisque. Aliquam consequat lacus eu ante ornare mattis. Praesent vitae est ut nibh maximus auctor. Donec eget sem eget lectus eleifend ullamcorper sit amet vel quam.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Why consequat lacus eu ante?</h3>
                                          <div className="answer">Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem. Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</div>
                                      </div>
                                  </section>

                                  <section id="support" className="doc-section">
                                      <h2 className="section-title">Support</h2>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Quisque consectetur iaculis odio</h3>
                                          <div className="answer">Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem. Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Duis maximus mollis sit amet pharetra?</h3>
                                          <div className="answer">Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem. Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</div>
                                      </div>
                                      <div className="section-block">
                                          <h3 className="question"><i className="fas fa-question-circle"/> Pellentesque habitant morbi tristique senectus?</h3>
                                          <div className="answer">
                                              <p>Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem. Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                                              <p>Integer ornare tristique massa, et efficitur diam. Quisque consectetur iaculis odio, in aliquet magna suscipit eget. Sed sollicitudin facilisis risus vitae mattis. Vivamus facilisis, lacus eu rutrum gravida, ante sapien semper lectus, eget venenatis lorem massa porta sapien. Curabitur facilisis egestas erat, vel facilisis ipsum laoreet sit amet. Sed fermentum metus eget semper semper. Pellentesque imperdiet accumsan dolor eu convallis. Donec dictum justo a leo pellentesque placerat. Maecenas non diam ac elit tincidunt convallis ut nec eros.</p>

                                          </div>
                                      </div>
                                  </section>

                              </div>
                          </div>
                          <div className="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
                              <div id="doc-nav" className="doc-nav">
                                  <nav id="doc-menu" className="nav doc-menu flex-column sticky">
                                      <a className="nav-link scrollto" href="#general">General</a>
                                      <a className="nav-link scrollto" href="#features">Features</a>
                                      <a className="nav-link scrollto" href="#pricing">Pricing</a>
                                      <a className="nav-link scrollto" href="#support">Support</a>
                                  </nav>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div id="promo-block" className="promo-block">
                  <div className="container">
                      <div className="promo-block-inner">
                          <h3 className="promo-title text-center"><i className="fas fa-heart"/> <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank">Are you an ambitious and entrepreneurial developer?</a></h3>
                          <div className="row">
                              <div className="figure-holder col-lg-5 col-md-6 col-12">
                                  <div className="figure-holder-inner">
                                      <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank"><img className="img-fluid" src="assets/images/demo/instance-promo.jpg" alt="Instance Theme" /></a>
                                      <a className="mask" href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/"><i className="icon fa fa-heart pink"/></a>

                                  </div>
                              </div>
                              <div className="content-holder col-lg-7 col-md-6 col-12">
                                  <div className="content-holder-inner">
                                      <div className="desc">
                                          <h4 className="content-title"><strong> Instance - Bootstrap 4 Portfolio Theme for Aspiring Developers</strong></h4>
                                          <p>Check out <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank">Instance</a> - a Bootstrap personal portfolio theme I created for developers. The UX design is focused on selling a developer’s skills and experience to potential employers or clients, and has <strong className="highlight">all the winning ingredients to get you hired</strong>. It’s not only a HTML site template but also a marketing framework for you to <strong className="highlight">build an impressive online presence with a high conversion rate</strong>. </p>
                                          <p><strong className="highlight">[Tip for developers]:</strong> If your project is Open Source, you can use this area to promote your other projects or hold third party adverts like Bootstrap and FontAwesome do!</p>
                                          <a className="btn btn-cta" href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank"><i className="fas fa-external-link-alt"/> View Demo</a>

                                      </div>


                                      <div className="author"><a href="https://themes.3rdwavemedia.com">Xiaoying Riley</a></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>

          </div>




        <h1>Introduction</h1>

        <section>
          <h2>Features</h2>

          <h4>Admin UI</h4>
          <p>
            Crud wizard uses OpenAPI specifications to render <strong>create</strong>, <strong>read</strong>, <strong>update</strong> and <strong>delete</strong> UI for resources defined by its users. It is similar to <a href="https://swagger.io/tools/swagger-ui/" target="_blank">Swagger UI</a>, but generates a fully functional admin UI instead of indivudual forms for each operation. Think <a href="https://keystonejs.com/" target="_blank">KeystoneJS</a> admin UI, or <a href="https://www.djangoproject.com/" target="_blank">django</a> admin. The admin UI generated by crud wizard consists of the following components:
          </p>
          <ul>
            <li>Navigation panel</li>
            <li>Create window</li>
            <li>List window</li>
            <li>Detail window</li>
            <li>Update window</li>
          </ul>
        </section>

        <section>
          <h2>Use Cases</h2>

          <h4>Internal Admin UI</h4>
          <p>As products begin to expose more of their core services using APIs that can be accessed programatically, the need for customer-facing user interfaces completely disappears in some cases. Popular examples of this type of product include <a href="https://www.twilio.com/" target="_blank">Twilio</a> and <a href="https://stripe.com/" target="_blank">Stripe</a>. When these types of companies are just getting started, they may not have the time or resources to build a polished user interface for their backend API, but still need some way to browse and manage resources using a GUI. Instead of hiring a frontend developer or spending time setting up tools that need to be built and deployed manually, they can use crud wizard to generate an Admin UI that covers 80% of their needs without having to change any of their existing code.</p>

          <h4>Development Tool</h4>
          <p>Crud wizard projects can be used alongside other tools like Postman or Swagger UI to give developers quick access to their API without having to spend time manually crafting calls to backend services. While Swagger UI provides fine-grained access to each operation in the spec, crud wizard's admin UI can provide a high-level, configurable UX that makes managing resources exposed by APIs more convenient.</p>
        </section>

      </DocsLayout>
    )
  }
}