import * as React from "react";

interface IProps {
  totalResults: number | null;
  numPerPage: number | null;
  currentPage: number;
  onClick: (page: number) => any;
}

export class Pagination extends React.Component<IProps, {}> {

  public render() {
    const { onClick, currentPage, numPerPage, totalResults } = this.props;
    const links: React.ReactNode[] = [];
    let text = "";

    let totalPages = 0;

    if (totalResults && numPerPage) {
      totalPages = Math.floor(totalResults / numPerPage);
      text = `Showing ${numPerPage.toLocaleString()} of ${totalResults.toLocaleString()} results`;
    }

    for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
      if (i >= 1 && totalPages && i <= totalPages) {
        links.push(
          <li key={i} className={`page-item ${currentPage === i ? "disabled" : ""}`}>
            <a onClick={() => onClick(i)} className="page-link" href="javascript:void(0);">{i.toLocaleString()}</a>
          </li>
        );
      }
    }

    return (
      <nav className="text-center w-100">
        <ul className="pagination">
          {totalPages > 0 && (
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <a onClick={() => onClick(1)} className="page-link" href="javascript:void(0);">
                <i className="zmdi zmdi-chevron-left" /><i className="zmdi zmdi-chevron-left" />
              </a>
            </li>
          )}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a onClick={() => onClick(currentPage - 1)} className="page-link" href="javascript:void(0);">
              <i className="zmdi zmdi-chevron-left" />
            </a>
          </li>
          {links}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <a onClick={() => onClick(currentPage + 1)} className="page-link" href="javascript:void(0);">
              <i className="zmdi zmdi-chevron-right" />
            </a>
          </li>
          {totalPages > 0 && (
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <a onClick={() => onClick(totalPages)} className="page-link" href="javascript:void(0);">
                <i className="zmdi zmdi-chevron-right" /><i className="zmdi zmdi-chevron-right" />
              </a>
            </li>
          )}
        </ul>
        {text && <p className="text-muted text-small">{text}</p>}
      </nav>
    );
  }
}