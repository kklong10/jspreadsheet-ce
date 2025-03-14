import dispatch from "./dispatch.js";
import { getCoordsFromCellName } from "./helpers.js";


const handleCellRender = function (obj, x, y, renderFn) {
    renderFn(
        obj.rows[y].element.children[x + 1],
        obj.options.data[y][x],
        parseInt(x),
        parseInt(y),
        obj,
        obj.options.columns[x],
    );
}

/**
 * Get render information from cell(s)
 *
 */
export const getCellRender = function (cellName) {
    if (cellName) {
        let coords = getCoordsFromCellName(cellName)
        return getCellRenderFromCoords(coords[0], coords[1]);
    } else {
        return null;
    }
}
export const getCellRenderFromCoords = function (x, y) {
    const obj = this;

    if (x > -1 && y > -1) {
        return obj.options.render && obj.options.render[x]?.[y] ? obj.options.render[x][y] : null;
    } else {
        return null;
    }
}

export const setCellRender = function (cellName, fn) {
    if (cellName) {
        let coords = getCoordsFromCellName(cellName)
        setCellRenderFromCoords(coords[0], coords[1]);
    }
}


/**
 * set render information
 *
 */
export const setCellRenderFromCoords = function (x, y, fn) {
    const obj = this;
    if (x > -1 && y > -1) {
        if (!fn) {
            //删除渲染
            if (obj.options.render && obj.options.render[x] && (y in obj.options.render[x])) {
                delete obj.options.render[x][y];
                //todo 删除渲染
            }
        }
        else {
            if (!obj.options.render) {
                obj.options.render = [];
            }
            if (!obj.options.render[x]) {
                obj.options.render[x] = [];
            }
            obj.options.render[x][y] = fn;
            handleCellRender(obj, x, y, fn);
        }
    }
}

export const moveCellRenderColumn = function (columnIndex, num) {
    const obj = this;
    if (!obj.options.render) {
        return;
    }
    //如果obj.options.render的key，按照从大到小的顺序排序，如果key》columnIndex则加num
    const keys = Object.keys(obj.options.render).sort((a, b) => {
        return parseInt(b) - parseInt(a);
    });
    for (let i = 0; i < keys.length; i++) {
        const key = parseInt(keys[i]);
        if (key >= columnIndex) {
            obj.options.render[key + num] = obj.options.render[key];
            delete obj.options.render[key];
        }
    }
}

//交换行位置
export const changeCellRenderColumn = function (fromIndex, toIndex) {
    const obj = this;
    if (!obj.options.render) {
        return;
    }
    //两个索引的值交换
    let temp = obj.options.render[fromIndex];
    if (toIndex in item) {
        obj.options.render[fromIndex] = obj.options.render[toIndex];
    }
    if (fromIndex in item) {
        obj.options.render[toIndex] = temp;
    }
}
export const deleteCellRenderColumn = function (columnIndex, num) {
    const obj = this;
    if (!obj.options.render) {
        return;
    }
    //如果obj.options.render的key，按照从小到大的顺序排序，如果key >=columnIndex则开始删除，最多删除Num
    const keys = Object.keys(obj.options.render);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key >= columnIndex) {
            delete obj.options.render[key];
            num--;
            if (num === 0) {
                break;
            }
        }

    }
}


export const moveCellRenderRow = function (rowIndex, num) {
    const obj = this;
    if (!obj.options.render) {
        return;
    }
    obj.options.render.forEach(item => {
        const keys = Object.keys(item).sort((a, b) => {
            return parseInt(b) - parseInt(a);
        });
        for (let i = 0; i < keys.length; i++) {
            const key = parseInt(keys[i]);
            if (key >= rowIndex) {
                item[key + num] = item[key];
                delete item[key];
            }
        }
    })
}
//交换行位置
export const changeCellRenderRow = function (fromIndex, toIndex) {
    const obj = this;
    if (!obj.options.render) {
        return;
    }
    obj.options.render.forEach(item => {
        //两个索引的值交换
        let temp = item[fromIndex];
        if (toIndex in item) {
            item[fromIndex] = item[toIndex];
        }
        if (fromIndex in item) {
            item[toIndex] = temp;
        }
    })
}


export const deleteCellRenderRow = function (rowIndex, num) {
    const obj = this;
    if (!obj.options.render) {
        return;
    }
    obj.options.render.forEach(item => {
        //如果key，按照从小到大的顺序排序，如果key >=rowIndex则开始删除，最多删除Num
        const keys = Object.keys(item);
        if (keys.length === num) {
            item = [];
        }
        else {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key >= rowIndex) {
                    delete item[key];
                    num--;
                    if (num === 0) {
                        break;
                    }
                }
            }
        }
    })
}
