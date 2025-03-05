import jspreadsheet from './index.js';

import './jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

const jss = jspreadsheet;

// window.instance = jspreadsheet(root, {
const instance = jspreadsheet(root, {
    tabs: true,
    toolbar: true,
    //失去焦点保持selection
    keepSelectionOnBlur: true,
    onselection: function (instance, x1, y1, x2, y2) {
        console.log(instance, x1, y1, x2, y2);
    },
    onblur: function (instance) {
        console.log('blur');
    },
    worksheets: [{
        minDimensions: [16, 6],
        columns: [
            {
                title: 'Name',
                width: 200,
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

