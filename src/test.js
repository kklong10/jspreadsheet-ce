import jspreadsheet from './index.js';

import './jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

const jss = jspreadsheet;

// window.instance = jspreadsheet(root, {
const instance = jspreadsheet(root, {
    tabs: true,
    toolbar: function (toolbar) {
        // Add a new custom item in the end of my toolbar
        toolbar.items.push({
            tooltip: 'My custom item',
            content: 'share',
            onclick: function () {
                let currentSheet = instance[0];
                console.log(currentSheet.records);
                const selection = currentSheet.getSelection();
                if (!selection) {
                    return;
                }
                let x1 = selection?.[0];
                let y1 = selection?.[1];
                if (currentSheet.getCellRenderFromCoords(x1, y1)) {
                    currentSheet.setCellRenderFromCoords(x1, y1, null
                    )
                }
                else {
                    currentSheet.setCellRenderFromCoords(x1, y1,
                        (cell, value, x, y, instance, options) => {
                            cell.innerHTML = `<span style='background-color:blue;padding:6px;'>${x1},${y1}</span>`;
                        }
                    )
                }
            }
        });

        return toolbar;
    },
    //失去焦点保持selection
    keepSelectionOnBlur: true,
    onselection: function (instance, x1, y1, x2, y2) {
    },
    onblur: function (instance) {
        console.log('blur');
    },
    worksheets: [{
        minDimensions: [16, 6],
        // render: {
        //     "A1": (cell, value, x, y, instance, options) => {
        //         console.log(cell, value, x, y, instance, options)
        //         cell.innerHTML = "<span style='background-color:blue'>barcode</span>";
        //     }
        // },
        columns: [
            {
                title: 'Name',
                width: 200,
                render: (cell, value, x, y, instance, options) => {
                    console.log("column render")
                    cell.innerHTML = `<span style='background-color:blue;padding:4px;'>${value}</span>`;
                }
            },
            {
                title: 'Age',
                width: 100,
            },
            {
                title: 'City',
                width: 200,
            },
            {
                title: 'Country',
                width: 200,
            },
            {
                title: 'Email',
                width: 200,
            },
        ],
    }],
})

