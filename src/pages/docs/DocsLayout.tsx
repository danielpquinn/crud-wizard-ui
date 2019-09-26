import * as React from "react";
import { Link } from "react-router-dom";
import { Title } from "../../components/Title";

interface IProps {
  title: string;
}

export class DocsLayout extends React.Component<IProps, {}> {

  public render() {
    const { children, title } = this.props;

    return (
      <div className="docs">
        <div className="page-wrapper">
          <header id="header" className="header">
            <div className="container">
              <div className="branding">
                <h1 className="logo">
                  <a href="http://localhost:3000/">
                    <span aria-hidden="true" className="icon_documents_alt icon" />
                    <span className="text-highlight">Crud Wizard</span><span className="text-bold" />
                  </a>
                </h1>
              </div>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </header>
          <div className="doc-wrapper">
            <div className="container">
              <div id="doc-header" className="doc-header text-center">
                <h1 className="doc-title"><span aria-hidden="true" className="icon icon_lifesaver" /><Title title={title} /></h1>
              </div>
              <div className="doc-body row">
                <div className="doc-content col-md-9 col-12 order-1">
                  <div className="content-inner">
                    <section id="general" className="doc-section">
                      {children}
                    </section>
                  </div>
                </div>
                <div className="doc-sidebar col-md-3 col-12 order-0 d-none d-md-flex">
                  <div id="doc-nav" className="doc-nav">
                    <nav id="doc-menu" className="nav doc-menu flex-column sticky">
                      <Link className="nav-link scrollto" to="/docs">Introduction</Link>
                      <Link className="nav-link scrollto" to="/docs/getting-started">Getting Started</Link>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="promo-block" className="promo-block">
            <div className="container">
              <div className="promo-block-inner">
                <h3 className="promo-title text-center"><i className="fas fa-heart" /> <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank">Are you an ambitious and entrepreneurial developer?</a></h3>
                <div className="row">
                  <div className="figure-holder col-lg-5 col-md-6 col-12">
                    <div className="figure-holder-inner">
                      <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank"><img className="img-fluid" src="assets/images/demo/instance-promo.jpg" alt="Instance Theme" /></a>
                      <a className="mask" href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/"><i className="icon fa fa-heart pink" /></a>

                    </div>
                  </div>
                  <div className="content-holder col-lg-7 col-md-6 col-12">
                    <div className="content-holder-inner">
                      <div className="desc">
                        <h4 className="content-title"><strong> Instance - Bootstrap 4 Portfolio Theme for Aspiring Developers</strong></h4>
                        <p>Check out <a href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank">Instance</a> - a Bootstrap personal portfolio theme I created for developers. The UX design is focused on selling a developer’s skills and experience to potential employers or clients, and has <strong className="highlight">all the winning ingredients to get you hired</strong>. It’s not only a HTML site template but also a marketing framework for you to <strong className="highlight">build an impressive online presence with a high conversion rate</strong>. </p>
                        <p><strong className="highlight">[Tip for developers]:</strong> If your project is Open Source, you can use this area to promote your other projects or hold third party adverts like Bootstrap and FontAwesome do!</p>
                        <a className="btn btn-cta" href="https://themes.3rdwavemedia.com/bootstrap-templates/portfolio/instance-bootstrap-portfolio-theme-for-developers/" target="_blank"><i className="fas fa-external-link-alt" /> View Demo</a>

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
    );
  }
}
