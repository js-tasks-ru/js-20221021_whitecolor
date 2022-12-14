export default class ColumnChart {
  chartHeight = 50;

  constructor({ data = [], value = '', formatHeading = value => value, label, link } = {}) {
    this.data = data;
    this.label = label || 0;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
  }

  getTitleTemplate() {
    let link = this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>` : '';
    return `<div class="column-chart__title">Total ${this.label && this.label}${link}</div>`;
  }

  getHeaderTemplate() {
    const intlValue = new Intl.NumberFormat().format(this.value);
    const headerData = this.formatHeading ? this.formatHeading(intlValue) : intlValue;
    return `<div data-element="header" class="column-chart__header">${headerData}</div>`;
  }

  getBodyTemplate() {
    const maxValue = Math.max(...this.data);
    const scaleValue = this.chartHeight / maxValue;
    const cols = this.data.map((value) => {
      const chartValue = Math.floor(scaleValue * value);
      const chartPercent = (value / maxValue * 100).toFixed(0);
      return `<div style="--value: ${chartValue}" data-tooltip="${chartPercent}%"></div>`
    })
    return `<div data-element="body" class="column-chart__chart">${cols.join('')}</div>`;
  }

  getChartTemplate() {
    return `${this.getTitleTemplate()}<div class="column-chart__container">${this.value ? this.getHeaderTemplate() : ''}
        ${this.data ? this.getBodyTemplate() : ''}</div>`;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "column-chart";
    wrapper.style.cssText = `--chart-height: ${this.chartHeight}`;
    if (!this.data || this.data.length === 0)
      wrapper.classList.add("column-chart_loading");
    wrapper.innerHTML = this.getChartTemplate();
    this.element = wrapper;
  }

  update(data) {
    this.data = data;
    this.render();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.data = null;
    this.label = null;
    this.value = null;
    this.link = null;
    this.formatHeading = null;
  }

  remove() {
    this.element.remove();
  }
}
