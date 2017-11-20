class Query {

  constructor() {
    this.urlParams = {};
  }

  readQueryString() {
    const search = /([^&=]+)=?([^&]*)/g;
    const query = window.location.search.substring(1);
    let match = null;
    // eslint-disable-next-line no-cond-assign
    while ((match = search.exec(query)) !== null) {
      this.urlParams[this.decode(match[1])] = this.decode(match[2]);
    }
  }

  decode(s) {
    const pl = /\+/g;
    return decodeURIComponent(s.replace(pl, ' '));
  }

  getParam(paramName) {
    return this.urlParams[paramName];
  }
}

export default Query;
