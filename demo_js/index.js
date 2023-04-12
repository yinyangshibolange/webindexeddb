(function () {
    let my_table_file = {}

    function dce(tag) {
        return document.createElement(tag)
    }

    function createFileTable(parent_el, table_id, list, columns) {
        if (my_table_file[table_id]) {
            parent_el.removeChild(my_table_file[table_id])
            my_table_file[table_id] = null
        }
        my_table_file[table_id] = dce("table")
        my_table_file[table_id].id = table_id
        my_table_file[table_id].classList.add("table")
        my_table_file[table_id].classList.add("table-striped")
        my_table_file[table_id].classList.add("table-hover")

        const thead = dce("thead")
        const tr = dce("tr")

        columns.forEach(item => {
            const {key, type, name} = item
            const th = dce("th")
            th.innerText = name
            tr.appendChild(th)
        })
        thead.appendChild(tr)
        my_table_file[table_id].appendChild(thead)
        const tbody = dce("tbody")
        tbody.classList.add("table-group-divider")
        list.forEach(item => {
            const tr = dce("tr")
            columns.forEach(col => {
                const {key, type, name, btns } = col
                const td = dce("td")
                if(type === 'data') {
                    td.innerText = item[key]
                } else if(type === 'image') {
                    const img = dce("img")
                    img.src = item[key]
                    img.width = 100
                    img.height = 100
                    img.style.objectFit = 'cover'
                    img.classList.add("rounded")
                    td.appendChild(img)
                } else if(type === 'btns') {
                    btns.forEach(btn_item => {
                        const {name, click} = btn_item
                        const btn_el = dce("button")
                        btn_el.setAttribute("type", "button")
                        btn_el.innerText = name
                        btn_el.classList.add("btn")
                        btn_el.classList.add("btn-danger")
                        btn_el.addEventListener('click', function(){
                            if(typeof click === 'function') {
                                click(item)
                            }
                        })
                        td.appendChild(btn_el)
                    })
                }

                tr.appendChild(td)
            })
            tbody.appendChild(tr)
        })
        my_table_file[table_id].appendChild(tbody)
        parent_el.appendChild(my_table_file[table_id])
        return my_table_file[table_id]
    }

    window.createFileTable = createFileTable

    function createPageDot(parent_el, page_id, list, cur_page) {
        if (my_table_file[page_id]) {
            parent_el.removeChild(my_table_file[page_id])
            my_table_file[page_id] = null
        }
         my_table_file[page_id] = dce("ul")
        my_table_file[page_id].classList.add("pagination")
        let lis = []
        list.forEach((item) => {
            var li = dce("li")
            lis.push(li)
            li.classList.add("page-item")
            var a_page = dce("a")
            a_page.classList.add("page-link")
            a_page.innerText = item.name || item.page
            if(item.page === cur_page) {
                li.classList.add("active")
            }
            if(item.type === 'prev' || item.type === 'next' || item.type === 'page') {
                a_page.addEventListener("click",function () {
                    if(typeof item.click === 'function') {
                        item.click(item)
                    }
                    if(item.type === 'page') {
                        lis.forEach(li_el => {
                            li_el.classList.remove("active")
                        })
                        li.classList.add("active")
                    }
                })
            }
            li.appendChild(a_page)
            my_table_file[page_id].appendChild(li)
        })
        parent_el.appendChild(my_table_file[page_id])
        return my_table_file[page_id]
    }

    window.createPageDot = createPageDot
})()
