import El from './index'

export default class ElTable extends El {

  static cr() {
    let el = new ElTable()
    el.domEl = document.createElement('table')
    return el
  }

  set data(value) {
    this._data = value
    if (this.data.length > 0 && this.def.length > 0) {
      this.render();
    } else {
      this.prerender()
    }
  }

  set def(value) {
    this._def = value
    if (this.data.length > 0 && this.def.length > 0) {
      this.render();
    } else {
      this.prerender()
    }
  }

  get data() {
    return this._data || []
  }

  get def() {
    return this._def || []
  }

  addDataItem(row) {
    var newData = this.data
    newData.push(row)
    this.data = newData

  }

  prerender(noDataLabel) {
    this.txt('')
    this._renderTableHeader()
    this._renderTableEmpty(noDataLabel)
  }

  render() {
    this.txt('')
    this._renderTableHeader()
    this._renderTableRows()
    return this
  }


  _renderTableHeader() {
    let def = this.def
    let tr = El.cr('tr')
    for (let i = 0; i < (def || []).length; i++) {
      tr.$ap(El.cr('th').txt(def[i].header).width(def[i].width))
    }
    this.$ap(tr)
  }

  _renderTableRows() {
    let data = this.data
    let def = this._def
    if ((data || []).length === 0) {
      this._renderTableEmpty(def)
    } else {
      for (let i = 0; i < (data || []).length; i++) {
        let tr = El.cr('tr').cls('row-' + data[i].id)
        for (let j = 0; j < (def || []).length; j++) {
          tr.$ap(
            El.cr('td')
              .txt(data[i][def[j].data] || '')
              .cls([def[j].class]))
        }
        this.$ap(tr)
      }
    }
  }

  _renderTableEmpty(noDataLabel) {
    let def = this._def
    let tr = El.cr('tr')
    let td = El.cr('td').txt(noDataLabel || '').attr('colspan', ((def || []).length))
    tr.$ap(td)
    this.$ap(tr)
  }
}
