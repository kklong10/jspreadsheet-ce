export = jspreadsheet;
export as namespace jspreadsheet;

declare const jspreadsheet: jspreadsheet.JSpreadsheet;

declare namespace jspreadsheet {
  type CellValue = string | number | boolean;

  type DropdownSourceItem =
    | string
    | number
    | {
        id: string | number;
        name: string;
        title?: string;
        image?: string;
        group?: string;
      };

  interface CalendarOptions {
    /**
     * @default "YYYY-MM-DD"
     */
    format?: string;

    /**
     * 以全屏模式打开日历（这会自动为屏幕尺寸 < 800 设置）。
     */
    fullscreen?: boolean;

    /** 占位符。 */
    placeholder?: string;

    /**
     * 允许键盘日期输入。
     * @default true
     */
    readonly?: boolean;

    /**
     * 显示重置按钮。
     * @default true
     */
    resetButton?: boolean;

    /**
     * 显示时间选择器。
     * @default false
     */
    time?: boolean;

    /** 默认为今天。 */
    today?: boolean;
  }

  interface CustomEditor {
    /**
     * 事件负责关闭具有自定义编辑器的单元格的编辑器。
     * @param cell - 应该关闭其编辑器的 Td 标签。
     * @param save - 如果为 true，则此事件返回的值将是单元格的新值。 否则，此事件返回的值将被忽略。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     * @param instance - 工作表实例。
     * @param options - 列配置对象。
     * @returns 新的单元格值。
     */
    closeEditor?: (
      cell: HTMLTableCellElement,
      save: boolean,
      x: number,
      y: number,
      instance: WorksheetInstance,
      options: Column
    ) => CellValue | undefined;

    /**
     * 创建新单元格时调用的事件。
     * @param cell - 准备作为新单元格的 HTML 元素。
     * @param value - 单元格值。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     * @param instance - 工作表实例。
     * @param options - 列配置对象。
     * @returns 将成为新单元格的 HTML 元素。
     */
    createCell?: (
      cell: HTMLTableCellElement,
      value: CellValue,
      x: number,
      y: number,
      instance: WorksheetInstance,
      options: Column
    ) => HTMLTableCellElement;

    /**
     * 事件负责打开具有自定义编辑器的单元格的编辑器。
     * @param cell - 应该打开其编辑器的 Td 标签。
     * @param value - 单元格值。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     * @param instance - 工作表实例。
     * @param options - 列配置对象。
     * @param e - 调用此方法的事件。
     */
    openEditor?: (
      cell: HTMLTableCellElement,
      value: CellValue,
      x: number,
      y: number,
      instance: WorksheetInstance,
      options: Column,
      e: KeyboardEvent | MouseEvent | TouchEvent | undefined
    ) => void;

    /**
     * 在更改单元格的值之前调用的事件。
     *
     * 返回的值将是单元格的新值。
     * @param cell - 其值已更改的单元格。
     * @param value - 新值。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     * @param instance - 工作表实例。
     * @param options - 列配置对象。
     */
    updateCell?: (
      cell: HTMLTableCellElement,
      value: CellValue | undefined,
      x: number,
      y: number,
      instance: WorksheetInstance,
      options: Column
    ) => CellValue | undefined;
  }

  type HorizontalAlign = "center" | "left" | "right" | "justify";

  interface BaseColumn {
    /** 单元格对齐方式。 */
    align?: HorizontalAlign;

    decimal?: string;

    /** 单元格掩码。 */
    mask?: string;

    /** 如果数据排列为对象数组，则用于引用此列的名称。 */
    name?: string;

    /**
     * 阻止用户更改单元格值。
     * @default false
     */
    readOnly?: boolean;

    /**
     * 定义在单元格值显示在电子表格中之前必须对其进行的修改。
     * @param cell - 其值已更改的单元格。
     * @param value - 新值。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     * @param instance - 工作表实例。
     * @param options - 列配置对象。
     */
    render?: (
      cell: HTMLTableCellElement,
      value: CellValue | undefined,
      x: number,
      y: number,
      instance: WorksheetInstance,
      options: Column
    ) => void;

    /**
     * 如果为 true，则列标题或单元格值内的 HTML 将被视为常规文本。
     *
     * 如果为 false，则 HTML 将被视为 HTML。
     * @default true
     */
    stripHTML?: boolean;

    /** 自定义列标题。 */
    title?: string;

    /**
     * 此列中单元格的类型。
     * @default "text"
     */
    type?:
      | "text"
      | "numeric"
      | "hidden"
      | "dropdown"
      | "autocomplete"
      | "checkbox"
      | "radio"
      | "calendar"
      | "image"
      | "color"
      | "html"
      | CustomEditor;

    /** 列宽。 */
    width?: string | number;

    /**
     * 在此列的单元格中启用自动换行。
     * @default false
     */
    wordWrap?: boolean;
  }

  interface DropdownColumn extends BaseColumn {
    autocomplete?: boolean;

    /**
     * 允许选择多个项目。
     * @default false
     */
    multiple?: boolean;

    /** 下拉列表中可用的选项。 */
    source?: DropdownSourceItem[];

    /** 从外部源获取选项的 Url。 */
    url?: string;
  }

  interface CalendarColumn extends BaseColumn {
    /** 日历选项。 */
    options?: CalendarOptions;
  }

  interface ColorColumn extends Omit<BaseColumn, "render"> {
    /** 如果未定义，则单元格显示颜色的十六进制代码，如果为“square”，则显示一个填充颜色的正方形。 */
    render?: "square";
  }

  type Column = DropdownColumn | CalendarColumn | ColorColumn | BaseColumn;

  interface Row {
    /** 行高。 */
    height?: string | number;

    /** 替换行号的文本。 */
    title?: string;
  }

  interface ToolbarItemBase {
    /** 悬停在此选项上时显示的工具提示。 */
    tooltip?: string;

    /**
     * 应更新工具栏状态时调用的方法。
     * @param toolbarElement - 工具栏 HTML 元素。
     * @param toolbarInstance - 工具栏实例。 有关更多信息，请阅读 jSuites 工具栏文档。
     * @param itemElement - 工具栏项目 HTML 元素。
     * @param worksheetInstance - 工作表实例。
     */
    updateState?: (
      toolbarElement: HTMLDivElement,
      toolbarInstance: Record<string, any>,
      itemElement: HTMLDivElement,
      worksheetInstance: WorksheetInstance
    ) => void;

    [property: string]: any;
  }

  interface ToolbarIconItem extends ToolbarItemBase {
    /** 定义图标（来自 material icons）。 */
    content: string;

    /**
     * 单击引用该项目的 html 项目时触发的事件。
     * @param toolbarElement - 工具栏 HTML 元素。
     * @param toolbarInstance - 工具栏实例。 有关更多信息，请阅读 jSuites 工具栏文档。
     * @param itemElement - 工具栏项目 HTML 元素。
     * @param event - 触发 onclick 的指针事件。
     */
    onclick?: (
      toolbarElement: HTMLDivElement,
      toolbarInstance: Record<string, any>,
      itemElement: HTMLDivElement,
      event: PointerEvent
    ) => void;
  }

  interface ToolbarSelectItem extends ToolbarItemBase {
    type: "select";

    /** 定义图标（来自 material icons）。 */
    content: string;

    /**
     * 更改项目选择器值时调用的事件。
     * @param itemElement - 工具栏项目 HTML 元素。
     * @param pickerInstance - 选择器实例。 有关更多信息，请阅读 jSuites 选择器文档。
     * @param value - 新的选择器值。
     * @param value2 - 新的选择器值。
     * @param valueIndex - 新的选择器值的索引。
     * @param event - 触发此事件的指针事件。
     */
    onchange?: (
      itemElement: HTMLDivElement,
      pickerInstance: Record<string, any>,
      value: string,
      value2: string,
      valueIndex: string,
      event: PointerEvent
    ) => void;

    /**
     * 选择器中可用的选项。
     */
    options?: string[];

    /**
     * 根据选择器选项创建选择器项目。
     * @param option - {@link ToolbarSelectItem.options} 数组中的一个项目。
     * @param pickerInstance - 选择器实例。 有关更多信息，请阅读 jSuites 选择器文档。
     * @returns 表示选择器项目的 HTML 的字符串。
     */
    render?: (option: string, pickerInstance: Record<string, any>) => string;

    /** selectbox 的初始值。 */
    value?: string;

    /** 项目宽度。 */
    width?: string;
  }

  interface ToolbarColorItem extends ToolbarItemBase {
    type: "color";

    /** 定义图标（来自 material icons）。 */
    content: string;

    /**
     * 输入值更改时应更改的样式。 如果设置了此属性，则 onclick 事件将被覆盖。
     */
    k: string;
  }

  interface ToolbarDivisorItem {
    type: "divisor";
  }

  /**
   * 构成工具栏配置数组的项目。 此项目可能具有此处未描述的属性。 有关更多信息，请阅读 jSuites 工具栏文档。
   */
  type ToolbarItem =
    | ToolbarIconItem
    | ToolbarSelectItem
    | ToolbarColorItem
    | ToolbarDivisorItem;

  interface NestedHeaderCell {
    id?: string;
    colspan?: number;
    title?: string;
    align?: string;
  }

  interface CellChange {
    newValue: CellValue;
    oldValue: CellValue;
    x: string;
    y: string;
  }

  interface HistoryRecord {
    action: string;
    [key: string]: any;
  }

  /**
   * 在列排序中比较的项目。
   *
   * 它分别由它所代表的行的索引和该行在排序列中的值组成。
   */
  type SortingItem = [number, CellValue];

  type MetaInformation = Record<string, any>;

  type ContextMenuItem = {
    type?: "line" | "divisor" | "default";
    title: string;
    icon?: string;
    id?: string;
    disabled?: boolean;
    onclick?: (instance: any, e: MouseEvent) => void;
    shortcut?: string;
    tooltip?: string;
    submenu?: Array<ContextMenuItem>;
  };

  type ContextMenuRole =
    | "select-all"
    | "fill-handle"
    | "row"
    | "nested"
    | "tabs"
    | "toolbar"
    | "pagination"
    | "cell"
    | "grid"
    | "footer"
    | "header"
    | "applications";

  interface SpreadsheetOptions {
    /**
     * 如果为 true，失去焦点时，将保持单元格选择。
     * @default false
     */
    keepSelectionOnBlur?: boolean;

    /**
     * 在上下文菜单中显示或不显示“关于”项目。
     * @default true
     */
    about?: boolean;

    /**
     * 允许将表格导出为 csv。
     * @default true
     */
    allowExport?: boolean;

    /**
     * 如果为 true，Jss 将尝试将公式中使用的单元格内容转换为数字
     * @default true
     */
    autoCasting?: boolean;

    /**
     * 使用拖动角时自动递增操作。
     * @default true
     */
    autoIncrement?: boolean;

    /**
     * 当用户使用鼠标右键单击时创建上下文菜单。
     * @param instance - 发生单击的工作表的实例。
     * @param colIndex - 单击元素的水平索引。 此值的含义取决于 {@link role} 参数。
     * @param rowIndex - 单击元素的垂直索引。 此值的含义取决于 {@link role} 参数。
     * @param event - 触发此事件的指针事件。
     * @param items - jss 默认上下文菜单。
     * @param role - 指示单击发生在电子表格的哪个部分。
     * @param x - 单击元素的水平索引。 此值的含义取决于 {@link role} 参数。
     * @param y - 单击元素的垂直索引。 此值的含义取决于 {@link role} 参数。
     * @returns 应创建的上下文菜单配置。
     */
    contextMenu?: (
      instance: WorksheetInstance,
      colIndex: string | number | null,
      rowIndex: string | number | null,
      event: PointerEvent,
      items: ContextMenuItem[],
      role: ContextMenuRole,
      x: string | number | null,
      y: string | number | null
    ) => ContextMenuItem[] | null | undefined;

    /**
     * 启用公式调试通知。
     * @default false
     */
    debugFormulas?: boolean;

    /**
     * 全屏模式。
     * @default false
     */
    fullscreen?: boolean;

    /**
     * 在下载中包含标题。
     * @default false
     */
    includeHeadersOnDownload?: boolean;

    /** 电子表格命名空间 */
    namespace?: string;

    /**
     * 在表格中应用所有更改后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param changes - 更改列表。
     */
    onafterchanges?: (
      instance: WorksheetInstance,
      changes: CellChange[]
    ) => void;

    /**
     * 在更改列值之前发生。 如果返回任何值，它将是单元格的新值。
     * @param instance - 将发生更改的工作表的实例。
     * @param cell - 表示正在更改的单元格的 HTML 元素。
     * @param colIndex - 正在更改的单元格列索引。
     * @param rowIndex - 正在更改的单元格行索引。
     * @param newValue - 正在应用于单元格的值。
     */
    onbeforechange?: (
      instance: WorksheetInstance,
      cell: HTMLTableCellElement,
      colIndex: string | number,
      rowIndex: string | number,
      newValue: CellValue
    ) => undefined | CellValue;

    /**
     * 在排除列之前发生。 如果此方法返回 false，则将取消删除。
     * @param instance - 将删除列的工作表的实例。
     * @param removedColumns - 要删除的列的索引。
     */
    onbeforedeletecolumn?: (
      instance: WorksheetInstance,
      removedColumns: number[]
    ) => undefined | boolean;

    /**
     * 在删除行之前发生。 如果此方法返回 false，则将取消删除。
     * @param instance - 将删除行的工作表的实例。
     * @param removedRows - 要删除的行的索引。
     */
    onbeforedeleterow?: (
      instance: WorksheetInstance,
      removedRows: number[]
    ) => undefined | boolean;

    /**
     * 在执行之前拦截并解析公式。
     * @param instance - 工作表的实例。
     * @param expression - 触发事件的公式。
     * @param x - 公式触发事件的单元格的列索引。
     * @param y - 公式触发事件的单元格的行索引
     */
    onbeforeformula?: (
      instance: WorksheetInstance,
      expression: string,
      x?: number,
      y?: number
    ) => false | string | undefined;

    /**
     * 在插入新列之前发生。 如果此方法返回 false，则将取消插入。
     * @param instance - 将添加列的工作表的实例。
     * @param columns - 要添加的列的设置。
     */
    onbeforeinsertcolumn?: (
      instance: WorksheetInstance,
      columns: {
        column: number;
        options: Column;
        data?: CellValue[];
      }[]
    ) => undefined | boolean;

    /**
     * 在插入新行之前发生。 如果此方法返回 false，则将取消插入。
     * @param instance - 将添加行的工作表的实例。
     * @param rows - 要添加的行的设置。
     */
    onbeforeinsertrow?: (
      instance: WorksheetInstance,
      rows: {
        row: number;
        data: CellValue[];
      }[]
    ) => undefined | boolean;

    /**
     * 在执行粘贴操作之前发生。
     *
     * 如果它返回 false，则 jss 取消粘贴。
     * 如果它返回一个字符串，它将是粘贴到工作表中的内容。
     *
     * @param instance - 将粘贴数据的工作表的实例。
     * @param copiedText - 正在粘贴到电子表格的文本。
     * @param colIndex - 将开始粘贴的列索引。
     * @param rowIndex - 将开始粘贴的行索引。
     */
    onbeforepaste?: (
      instance: WorksheetInstance,
      copiedText: { value: CellValue }[][],
      colIndex: number | string,
      rowIndex: number | string
    ) => undefined | boolean | string;

    /**
     * 在将任何更改持久保存到服务器之前发生。
     *
     * 仅当电子表格具有 {@link WorksheetOptions.persistence} 属性集时才调用此事件。
     *
     * 如果此事件返回 false，则更改不会持久保存在服务器上。
     * 如果它返回一个真值，则该值将持久保存，而不是初始值。
     * @param spreadsheetInstance - 电子表格实例。
     * @param worksheetInstance - 要保存的工作表的实例。
     * @param data - 更改的数据。
     */
    onbeforesave?: (
      spreadsheetInstance: SpreadsheetInstance,
      worksheetInstance: WorksheetInstance,
      data: { row: number; data: Record<number, CellValue> }[]
    ) => any;

    /**
     * 在更改选择之前发生。
     * @param instance - 将发生选择的工作表实例。
     * @param borderLeftIndex - 选择所包含的第一列的索引。
     * @param borderTopIndex - 选择所包含的第一行的索引。
     * @param borderRightIndex - 选择所包含的最后一列的索引。
     * @param borderBottomIndex - 选择所包含的最后一行的索引。
     * @param origin - 触发此 jss 事件的 Javascript 事件。
     */
    onbeforeselection?: (
      instance: WorksheetInstance,
      borderLeftIndex: number,
      borderTopIndex: number,
      borderRightIndex: number,
      borderBottomIndex: number,
      origin: Event | undefined
    ) => false | undefined;

    /**
     * 当表格失去焦点时发生。
     * @param instance - 失去焦点的工作表的实例。
     */
    onblur?: (instance: WorksheetInstance) => void;

    /**
     * 在更改列值之后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param cell - 表示正在更改的单元格的 HTML 元素。
     * @param colIndex - 正在更改的单元格列索引。
     * @param rowIndex - 正在更改的单元格行索引。
     * @param newValue - 新的单元格值。
     * @param oldValue - 旧的单元格值。
     */
    onchange?: (
      instance: WorksheetInstance,
      cell: HTMLTableCellElement,
      colIndex: string | number,
      rowIndex: string | number,
      newValue: CellValue,
      oldValue: CellValue
    ) => void;

    /**
     * 更改列标题时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param colIndex - 已重命名的列的索引。
     * @param newValue - 新的列标题。
     * @param oldValue - 旧的列标题。
     */
    onchangeheader?: (
      instance: WorksheetInstance,
      colIndex: number,
      newValue: string,
      oldValue: string
    ) => void;

    /**
     * 调用“setMeta”时发生。
     *
     * @param instance - 发生更改的工作表的实例。
     * @param cellName - 包含元数据更改的对象。
     */
    onchangemeta?: (
      instance: WorksheetInstance,
      cellName: Record<string, any>
    ) => void;

    /**
     * 更改页面时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param newPageNumber - 工作表所在的页面。
     * @param oldPageNumber - 工作表所在的页面。
     * @param quantityPerPage - 页面上的最大行数。
     */
    onchangepage?: (
      instance: WorksheetInstance,
      newPageNumber: number,
      oldPageNumber: number,
      quantityPerPage: number
    ) => void;

    /**
     * 调用“setStyle”时发生。
     *
     * @param instance - 发生更改的工作表的实例。
     * @param cellName - 包含更改的对象。
     */
    onchangestyle?: (
      instance: WorksheetInstance,
      changes: Record<string, string>
    ) => void;

    /**
     * 更改注释时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param newComments - 新的注释。
     * @param oldComments - 旧的注释。
     */
    oncomments?: (
      instance: WorksheetInstance,
      newComments: Record<string, string | null>,
      oldComments: Record<string, string | null>
    ) => void;

    /**
     * 复制一个或多个单元格的内容时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param selectedRange - 复制的单元格范围。
     * @param copiedData - 来自复制的单元格范围的数据。
     * @param cut - 如果为 true，则操作为剪切。 否则，操作为复制。
     */
    oncopy?: (
      instance: WorksheetInstance,
      selectedRange: [number, number, number, number],
      copiedData: string,
      cut: boolean | undefined
    ) => string | false | undefined;

    /**
     * 创建单元格时发生。
     * @param instance - 创建单元格的工作表的实例。
     * @param cell - 单元格 HTML 元素。
     * @param colIndex - 单元格列索引。
     * @param rowIndex - 单元格行索引。
     * @param newValue - 单元格值。
     */
    oncreatecell?: (
      instance: WorksheetInstance,
      cell: HTMLTableCellElement,
      colIndex: number,
      rowIndex: number,
      newValue: CellValue
    ) => void;

    /**
     * 打开编辑器时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param td - 打开其编辑器的单元格的 Td 标签。
     * @param colIndex - 打开其编辑器的单元格的列索引。
     * @param rowIndex - 打开其编辑器的单元格的行索引。
     * @param input - 打开的编辑器的输入。
     * @param options - 列设置。
     */
    oncreateeditor?: (
      instance: WorksheetInstance,
      td: HTMLTableCellElement,
      colIndex: number,
      rowIndex: number,
      input: null,
      options: Column
    ) => void;

    /**
     * 在排除列之后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param removedColumns - 已删除的列的索引。
     */
    ondeletecolumn?: (
      instance: WorksheetInstance,
      removedColumns: number[]
    ) => void;

    /**
     * 在排除行之后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param removedRows - 已删除的行的索引。
     */
    ondeleterow?: (instance: WorksheetInstance, removedRows: number[]) => void;

    /**
     * 调用 closeEditor 时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param td - 打开其编辑器的单元格的 Td 标签。
     * @param colIndex - 打开其编辑器的单元格的列索引。
     * @param rowIndex - 打开其编辑器的单元格的行索引。
     * @param editorValue - 编辑器中的值。
     * @param wasSaved - 编辑器中的值是否已保存在单元格中。
     */
    oneditionend?: (
      instance: WorksheetInstance,
      td: HTMLTableCellElement,
      colIndex: number,
      rowIndex: number,
      editorValue: CellValue,
      wasSaved: boolean
    ) => void;

    /**
     * 调用 openEditor 时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param td - 打开其编辑器的单元格的 Td 标签。
     * @param colIndex - 打开其编辑器的单元格的列索引。
     * @param rowIndex - 打开其编辑器的单元格的行索引。
     */
    oneditionstart?: (
      instance: WorksheetInstance,
      td: HTMLTableCellElement,
      colIndex: number,
      rowIndex: number
    ) => void;

    /**
     * 触发任何其他事件时触发的事件。 它在调用的事件之前运行。
     *
     * 如果未定义调用的事件，则 jss 将 onevent 返回的值视为调用的事件返回的值。
     * @param event - 调用的事件的名称。
     * @param rest - 调用的事件的参数。
     */
    onevent?: (event: string, ...rest: any[]) => any;

    /**
     * 当表格获得焦点时发生。
     * @param instance - 获得焦点的工作表的实例。
     */
    onfocus?: (instance: WorksheetInstance) => void;

    /**
     * 在插入新列之后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param columns - 已添加的列。
     */
    oninsertcolumn?: (
      instance: WorksheetInstance,
      columns: {
        column: number;
        options: Column;
        data?: CellValue[];
      }[]
    ) => void;

    /**
     * 在插入新行之后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param rows - 已添加的行。
     */
    oninsertrow?: (
      instance: WorksheetInstance,
      rows: {
        row: number;
        data: CellValue[];
      }[]
    ) => void;

    /**
     * 创建电子表格时触发的事件。
     * @param instance - Jspreadsheet 实例。
     */
    onload?: (instance: SpreadsheetInstance) => void;

    /**
     * 合并一组单元格时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param merges - 已创建的合并。
     */
    onmerge?: (
      instance: WorksheetInstance,
      merges: Record<string, [number, number]>
    ) => void;

    /**
     * 将列移动到新位置后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param oldPosition - 移动前的列索引。
     * @param newPosition - 移动后的列索引。
     * @param quantity - 移动的列数。
     */
    onmovecolumn?: (
      instance: WorksheetInstance,
      oldPosition: number,
      newPosition: number,
      quantity: number
    ) => void;

    /**
     * 将行移动到新位置后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param oldPosition - 移动前的行索引。
     * @param newPosition - 移动后的行索引。
     * @param quantity - 移动的行数。
     */
    onmoverow?: (
      instance: WorksheetInstance,
      oldPosition: number,
      newPosition: number,
      quantity: number
    ) => void;

    /**
     * 在 javascript 表中执行粘贴操作后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param pastedInfo - 粘贴到工作表中的信息。
     */
    onpaste?: (
      instance: WorksheetInstance,
      pastedInfo: {
        x: number;
        y: number;
        value: CellValue;
      }[][]
    ) => void;

    /**
     * 重做更改时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param historyRecord - 已重做的历史记录项。 如果没有更多操作可以重做，则它采用未定义的值。
     */
    onredo?: (
      instance: WorksheetInstance,
      historyRecord: HistoryRecord | undefined
    ) => void;

    /**
     * 更改列宽后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param colIndex - 已调整大小的列的索引。
     * @param newWidth - 新的列宽。
     * @param oldWidth - 旧的列宽。
     */
    onresizecolumn?: (
      instance: WorksheetInstance,
      colIndex: number | number[],
      newWidth: number | number[],
      oldWidth: number | number[]
    ) => void;

    /**
     * 更改行高后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param rowIndex - 正在调整大小的行的索引。
     * @param newHeight - 新的行高。
     * @param oldHeight - 旧的行高。
     */
    onresizerow?: (
      instance: WorksheetInstance,
      rowIndex: number,
      newHeight: number,
      oldHeight: number
    ) => void;

    /**
     * 在服务器上持久保存成功时发生。
     * @param spreadsheetInstance - 电子表格实例。
     * @param worksheetInstance - 要保存的工作表的实例。
     * @param data - 已发送到服务器的数据。
     */
    onsave?: (
      spreadsheetInstance: SpreadsheetInstance,
      worksheetInstance: WorksheetInstance,
      data: any
    ) => void;

    /**
     * 更改选择时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param borderLeftIndex - 选择所包含的第一列的索引。
     * @param borderTopIndex - 选择所包含的第一行的索引。
     * @param borderRightIndex - 选择所包含的最后一列的索引。
     * @param borderBottomIndex - 选择所包含的最后一行的索引。
     * @param origin - 触发此 jss 事件的 Javascript 事件。
     */
    onselection?: (
      instance: WorksheetInstance,
      borderLeftIndex: number,
      borderTopIndex: number,
      borderRightIndex: number,
      borderBottomIndex: number,
      origin: Event | undefined
    ) => void;

    /**
     * 对列进行排序后发生。
     * @param instance - 发生更改的工作表的实例。
     * @param colIndex - 已排序的列的索引。
     * @param order - 排序方向。 0 表示升序，1 表示降序。
     * @param newOrderValues - 行的新顺序。
     */
    onsort?: (
      instance: WorksheetInstance,
      colIndex: number,
      order: 0 | 1,
      newOrderValues: number[]
    ) => void;

    /**
     * 撤消更改时发生。
     * @param instance - 发生更改的工作表的实例。
     * @param historyRecord - 已撤消的历史记录项。 如果没有更多操作可以撤消，则它采用未定义的值。
     */
    onundo?: (
      instance: WorksheetInstance,
      historyRecord: HistoryRecord | undefined
    ) => void;

    /**
     * 启用表格内公式的执行。
     * @default true
     */
    parseFormulas?: boolean;

    /**
     * 用于对列进行排序的函数。 如果未指定，将使用默认函数。
     * @param order - 排序方向。 0 表示升序，1 表示降序。
     */
    sorting?: (
      order: 0 | 1
    ) => (itemA: SortingItem, itemB: SortingItem) => number;

    /**
     * 如果为 false，则单元格值内的 HTML 将被视为常规文本。 如果为 true，则 HTML 将被视为 HTML。
     * @default false
     */
    parseHTML?: boolean;

    /** 添加自定义工具栏。 */
    toolbar?:
      | boolean
      | ToolbarItem[]
      | ((defaultToolbar: ToolbarItem[]) => ToolbarItem[])
      | Record<string, any>;

    /**
     * 工作表设置。
     */
    worksheets: WorksheetOptions[];
  }

  interface WorksheetOptions {
    /**
     * 允许对单元格进行注释。
     * @default true
     */
    allowComments?: boolean;

    /**
     * 允许删除列。
     * @default true
     */
    allowDeleteColumn?: boolean;

    /**
     * 允许删除行。
     * @default true
     */
    allowDeleteRow?: boolean;

    /**
     * 允许删除所有行。 否则，将保留至少一行。
     * @default false
     */
    allowDeletingAllRows?: boolean;

    /**
     * 允许插入新列。
     * @default true
     */
    allowInsertColumn?: boolean;

    /**
     * 允许插入新行。
     * @default true
     */
    allowInsertRow?: boolean;

    /**
     * 允许用户在最后一列上使用 tab 键插入新列。
     * @default true
     */
    allowManualInsertColumn?: boolean;

    /**
     * 允许用户在最后一行上使用空格键插入新行。
     * @default true
     */
    allowManualInsertRow?: boolean;

    /**
     * 允许重命名列。
     * @default true
     */
    allowRenameColumn?: boolean;

    /**
     * Css 类应用于单元格。 每个单元格只接受一个类。
     * @example
     * {
     *    A1: "some-class",
     *    B3: "another-class"
     * }
     */
    classes?: Record<string, string>;

    /**
     * 允许列拖动。
     * @default true
     */
    columnDrag?: boolean;

    /**
     * 允许调整列大小。
     * @default true
     */
    columnResize?: boolean;

    /** 列设置。 */
    columns?: Column[];

    /**
     * 允许列排序。
     * @default true
     */
    columnSorting?: boolean;

    /**
     * 工作表注释。 每个对象键是一个单元格名称，其值是其注释。
     */
    comments?: Record<string, string>;

    /**
     * 从此 URL 加载外部 CSV 文件。
     */
    csv?: string;

    /**
     * CSV 文件的默认分隔符。 此值用于导入和导出。
     * @default ","
     */
    csvDelimiter?: string;

    /**
     * 下载方法的默认文件名。
     * @default "jspreadsheet"
     */
    csvFileName?: string;

    /**
     * 从 CSV 文件加载标题标题。
     * @default false
     */
    csvHeaders?: boolean;

    /** 加载到电子表格中的数据。 */
    data?: CellValue[][] | Record<string, CellValue>[];

    /**
     * 当列未指定对齐方式时使用的默认水平对齐方式。
     * @default "center"
     */
    defaultColAlign?: HorizontalAlign;

    /**
     * 未指定宽度的列的默认宽度。
     * @default 100
     */
    defaultColWidth?: number;

    /**
     * 默认行高。
     */
    defaultRowHeight?: number;

    /**
     * 允许表格编辑。
     * @default true
     */
    editable?: boolean;

    /**
     * 启用列过滤器。
     * @default false
     */
    filters?: boolean;

    /**
     * 设置电子表格的初始页脚
     */
    footers?: string[][];

    /**
     * 冻结电子表格顶部的列数。
     */
    freezeColumns?: number;

    /** 激活表格延迟加载。 */
    lazyLoading?: boolean;

    /** 在表格初始化中要合并的单元格。 */
    mergeCells?: Record<string, [number, number]>;

    /**
     * 元信息。
     */
    meta?: Record<string, MetaInformation>;

    /**
     * 最小表格尺寸：[列，行]。
     * @default [0, 0]
     */
    minDimensions?: [number, number];

    /**
     * 最小备用列数。
     * @default 0
     */
    minSpareCols?: number;

    /**
     * 最小备用行数。
     * @default 0
     */
    minSpareRows?: number;

    /** 定义嵌套标题。 */
    nestedHeaders?: NestedHeaderCell[][];

    /** 每页的行数。 */
    pagination?: number;

    /**
     * 下拉列表中可用的选项，用于选择每页的行数。
     *
     * 仅当 {@link WorksheetOptions.search} 选项为 true 且 {@link WorksheetOptions.pagination} 选项大于 0 时，此下拉列表才可见。
     */
    paginationOptions?: number[];

    /**
     * 尝试在使用表标记创建实例时识别列类型。
     * @default false
     */
    parseTableAutoCellType?: boolean;

    /**
     * 如果使用表标记创建实例，如果此标记没有标题，则将第一行转换为标题。
     * @default false
     */
    parseTableFirstRowAsHeader?: boolean;

    /**
     * 持久保存数据的请求将发送到的路由。 如果为 true，则使用 {@link WorksheetOptions.url} 属性值。
     */
    persistence?: boolean | string;

    /**
     * 电子表格插件。
     */
    plugins?: Record<string, () => Plugin>;

    /**
     * 用于绑定 javascript 事件的 DOM 元素。 此属性通常在 JSS 作为 Web 组件运行时使用。
     */
    root?: HTMLElement;

    /**
     * 允许行拖动。
     * @default true
     */
    rowDrag?: boolean;

    /**
     * 允许调整行大小。
     * @default true
     */
    rowResize?: boolean;

    /** 行设置。 */
    rows?: Row[] | Record<number, Row>;

    /**
     * 允许在表格中搜索。
     * @default false
     */
    search?: boolean;

    /**
     * 如果为 true，Jss 将大写公式中包含的字符。 这不适用于双引号内的字符，它们表示公式中的文本。
     * @default true
     */
    secureFormulas?: boolean;

    /**
     * 在选择的右下角显示复制图标。
     * @default true
     */
    selectionCopy?: boolean;

    /**
     * 单元格样式。
     */
    style?: Record<string, string>;

    /**
     * 设置表格的最大高度。
     * 仅当允许 {@link WorksheetOptions.tableOverflow} 时才使用此属性。
     */
    tableHeight?: string | number;

    /**
     * 允许表格溢出。
     * @default false
     */
    tableOverflow?: boolean;

    /**
     * 设置表格的最大宽度。
     * 仅当允许 {@link WorksheetOptions.tableOverflow} 时才使用此属性。
     */
    tableWidth?: string | number;

    /**
     * 如果为 true，则单元格内容可能会溢出到空单元格上。
     * @default false
     */
    textOverflow?: boolean;

    /** 从此 URL 加载外部 json 文件。 */
    url?: string;

    /**
     * 全局自动换行。
     * @default false
     */
    wordWrap?: boolean;
  }

  interface JspreadsheetInstanceElement extends HTMLDivElement {
    /**
     * Jss 实例所属的元素
     */
    spreadsheet: SpreadsheetInstance;
  }

  interface JworksheetInstanceElement extends HTMLDivElement {
    /**
     * Jss 工作表实例所属的元素
     */
    jspreadsheet: WorksheetInstance;
  }

  interface DragInfo {
    /**
     * 行或列将被移动到的索引。
     */
    destination: number;
  }

  interface DragColumnInfo extends DragInfo {
    /**
     * 正在移动的列的索引。
     */
    column: string;

    /**
     * 对应于正在移动的列的 HTML 元素。
     */
    element: HTMLTableCellElement;
  }

  interface DragRowInfo extends DragInfo {
    /**
     * 正在移动的行的索引。
     */
    row: string;

    /**
     * 对应于正在移动的行的 HTML 元素。
     */
    element: HTMLTableRowElement;
  }

  interface ResizeInfo {
    /**
     * 调整大小开始时的鼠标位置。 此位置指的是垂直轴（调整行大小时）或水平轴（调整列大小时）。
     */
    mousePosition: number;
  }

  interface ResizeRowInfo extends ResizeInfo {
    /**
     * 表示行的 HTML 元素。
     */
    element: HTMLTableRowElement;

    /**
     * 旧行高。
     */
    height: number;

    /**
     * 正在调整大小的行的索引。
     */
    row: string;
  }

  interface ResizeColumnInfo extends ResizeInfo {
    /**
     * 正在调整大小的列的索引。
     */
    column: string;

    /**
     * 旧列宽度。
     */
    width: number;
  }

  interface Plugin {
    /**
     * 在创建工作表之前调用此方法。
     * @param instance - 新工作表实例。
     */
    beforeinit?: (instance: WorksheetInstance) => void;

    /**
     * 获取电子表格配置信息。
     */
    getConfig: () => SpreadsheetOptions;

    /**
     * 创建工作表时调用此方法。
     * @param instance - 新工作表实例。
     */
    init?: (instance: WorksheetInstance) => void;

    /**
     * 触发任何其他事件时触发的事件。
     * @param event - 调用的事件的名称。
     * @param rest - 调用的事件的参数。
     */
    onevent?: (event: string, ...rest: any[]) => void;

    /**
     * 在电子表格将数据发送到服务器之前调用此方法。
     * @param instance - 工作表实例。
     * @param method - 需要在服务器上保存执行的​​方法的名称。
     * @param data - 需要在服务器上保存执行的​​方法的参数。
     */
    persistence?: (
      instance: WorksheetInstance,
      method: string,
      data: any
    ) => void;

    /**
     * 在显示上下文菜单之前调用的方法。 如果此方法返回除假值以外的任何值，则该值会覆盖上下文菜单设置。
     * @param instance - 发生单击的工作表的实例。
     * @param colIndex - 单击元素的水平索引。 此值的含义取决于 {@link role} 参数。
     * @param rowIndex - 单击元素的垂直索引。 此值的含义取决于 {@link role} 参数。
     * @param event - 触发此方法的指针事件。
     * @param items - jss 默认上下文菜单。
     * @param role - 指示单击发生在电子表格的哪个部分。
     * @param x - 单击元素的水平索引。 此值的含义取决于 {@link role} 参数。
     * @param y - 单击元素的垂直索引。 此值的含义取决于 {@link role} 参数。
     * @returns 应创建的上下文菜单配置。
     */
    contextMenu?: (
      instance: WorksheetInstance,
      colIndex: number | null,
      rowIndex: number | null,
      event: PointerEvent,
      items: ContextMenuItem[],
      role: ContextMenuRole,
      x: number | null,
      y: number | null
    ) => ContextMenuItem[] | null | undefined;

    /**
     * 在显示工具栏之前调用的方法。 如果此方法返回除假值以外的任何值，则该值会覆盖工具栏设置。
     * @param defaultToolbar
     */
    toolbar?: (
      defaultToolbar: ToolbarItem[]
    ) => ToolbarItem[] | null | undefined;
  }

  interface SpreadsheetInstance {
    /**
     * 电子表格设置。
     */
    config: SpreadsheetOptions;

    /**
     * 此 jss 实例的 Jsuites 上下文菜单
     */
    contextMenu: HTMLDivElement;

    /**
     * 此 jss 实例的根 HTML 元素。
     */
    el: JspreadsheetInstanceElement;

    /**
     * el 的别名。
     */
    element: JspreadsheetInstanceElement;

    /**
     * 切换表格全屏模式。
     * @param activate - 所需的模式。 默认：当前模式的相反。
     */
    fullscreen: (activate?: boolean) => void;

    /**
     * 获取当前活动工作表的索引
     */
    getWorksheetActive: () => number;

    /**
     * 隐藏工具栏。
     */
    hideToolbar: () => void;

    /**
     * 如果为 true，则电子表格不会发出事件。
     */
    ignoreEvents?: boolean;

    /**
     * 电子表格插件。
     */
    plugins: Record<string, Plugin>;

    /**
     * 更改电子表格设置。
     * @param config - 新设置。
     */
    setConfig: (config: SpreadsheetOptions) => void;

    /**
     * 向电子表格添加新插件。
     * @param plugins - 新插件。
     */
    setPlugins: (plugins: Record<string, () => Plugin>) => void;

    /**
     * 使用当前设置显示工具栏。
     */
    showToolbar: () => void;

    /**
     * 此 jss 实例的 HTML div 标签。
     */
    toolbar: HTMLDivElement;

    /**
     * 组成此电子表格的工作表实例。
     */
    worksheets: WorksheetInstance[];
  }

  interface WorksheetInstance {
    ads: HTMLDivElement;

    /**
     * 关闭单元格编辑器。
     * @param cell - HTML td 标签，其编辑器必须关闭。
     * @param save - 是否将编辑器内容保存在单元格中。
     */
    closeEditor: (cell: HTMLTableCellElement, save: boolean) => void;

    /**
     * 此电子表格表的“col”标签列表
     */
    cols: {
      colElement: HTMLTableColElement;
      x: number;
    }[];

    /**
     * 此电子表格表的 Colgroup 标签
     */
    colgroupContainer: HTMLElement;

    content: HTMLDivElement;

    /**
     * 复制或剪切工作表中选定单元格的内容。
     * @param cut - 如果为 true，则操作为剪切，如果不是，则为复制。
     */
    copy: (cut?: boolean) => void;

    /**
     * 位于选择右下角的 HTML 元素。
     */
    corner: HTMLDivElement;

    /**
     * 创建新工作表。
     * @param options - 工作表选项。
     */
    createWorksheet: (options: WorksheetOptions) => void;

    cursor: null | HTMLElement;

    /**
     * 最后复制的内容。
     */
    data: string;

    /**
     * 删除列。
     *
     * 如果 {@link SpreadsheetOptions.onbeforedeletecolumn} 事件返回 false 或“此操作将破坏任何现有的合并单元格。您确定吗？”对话框收到否定响应。
     * @param columnNumber - 删除开始的列索引。
     * @param numOfColumns - 要删除的列数。
     */
    deleteColumn: (
      columnNumber?: number,
      numOfColumns?: number
    ) => false | undefined;

    /**
     * 删除行。
     *
     * 如果 {@link SpreadsheetOptions.onbeforedeleterow} 事件返回 false 或对话框案例“此操作将破坏任何现有的合并单元格。您确定吗？”或“此操作将清除您的搜索结果。您确定吗？”收到否定响应。
     * @param rowNumber - 删除开始的行索引。
     * @param numOfRows - 要删除的行数。
     */
    deleteRow: (rowNumber?: number, numOfRows?: number) => false | undefined;

    /**
     * 删除工作表。
     * @param position - 工作表索引。
     */
    deleteWorksheet: (position: number) => void;

    /**
     * 删除所有合并的单元格。
     */
    destroyMerge: () => void;

    /**
     * 触发事件。
     * @param event - 事件名称。
     * @param args - 应传递给事件的参数。
     */
    dispatch: (event: string, ...args: any[]) => any;

    /**
     * 模拟“向下箭头”键的操作。
     * @param shiftKey - 如果为 true，则该方法模拟按下 Shift 键时“向下箭头”键的操作。
     * @param ctrlKey - 如果为 true，则该方法模拟按下 Ctrl 键时“向下箭头”键的操作。
     */
    down: (shiftKey?: boolean, ctrlKey?: boolean) => void;

    /**
     * 获取当前数据作为 CSV 文件。
     * @param includeHeaders - 如果为 true，则包含标题，而不管 {@link SpreadsheetOptions.includeHeadersOnDownload} 属性值如何。
     * @param processed - 如果为 true，则结果将包含显示的单元格值。 否则，结果将包含实际的单元格值。
     */
    download: (includeHeaders?: boolean, processed?: boolean) => void;

    /**
     * 存储有关正在移动的行或列的信息。
     */
    dragging: null | DragColumnInfo | DragRowInfo;

    /**
     * 当前打开的编辑器信息。 分别是编辑器打开的单元格、其初始值、其列索引和其行索引。
     */
    edition: null | [HTMLTableCellElement, string, string, string];

    /**
     * 此工作表实例的根 HTML 元素。
     */
    element: JworksheetInstanceElement;

    /**
     * 执行公式。
     * @param expression - 要执行的公式。
     * @param x - 公式所在单元格的列索引。
     * @param y - 公式所在单元格的行索引。
     */
    executeFormula: (expression: string, x?: number, y?: number) => any;

    /**
     * 表行包含过滤器输入。
     */
    filter: null | HTMLTableRowElement;

    /**
     * 活性过滤器。
     */
    filters: (string[] | null)[];

    /**
     * 模拟 Home 键的操作。
     * @param shiftKey - 如果为 true，则该方法模拟按下 Shift 键时 Home 键的操作。
     * @param ctrlKey - 如果为 true，则该方法模拟按下 Ctrl 键时 Home 键的操作。
     */
    first: (shiftKey?: boolean, ctrlKey?: boolean) => void;

    /**
     * 在其他公式中使用的公式列表。 每个键是包含公式的单元格的名称，每个值是其公式使用键中指定的单元格的单元格列表。
     */
    formula: Record<string, string[]>;

    /**
     * 按单元格名称获取单元格 DOM 元素。
     * @param cell - 单元格名称。
     */
    getCell(cell: string): HTMLTableCellElement;

    /**
     * 按单元格坐标获取单元格 DOM 元素。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     */
    getCell(x: number, y: number): HTMLTableCellElement;

    /**
     * 按单元格坐标获取单元格 DOM 元素。
     * @param x - 列索引。
     * @param y - 行索引。
     */
    getCellFromCoords: (x: number, y: number) => HTMLTableCellElement;

    /**
     * 按索引获取一列的数据。
     * @param columnNumber - 列索引。
     * @param processed - 如果为 true，则返回是使用单元格的 innerHTML 构建的。 否则，它是使用 {@link WorksheetOptions.data} 属性构建的。 默认：假。
     */
    getColumnData: (columnNumber: number, processed?: boolean) => CellValue[];

    /**
     * 从一个或所有单元格获取注释。
     * @param cell - 单元格名称。 如果它是一个假值，则返回所有单元格的注释。
     */
    getComments: (cell?: string) => Record<string, string> | string;

    /**
     * 获取工作表配置信息。
     */
    getConfig: () => WorksheetOptions;

    /**
     * 获取全部或部分表格数据。
     * @param highlighted - 如果为 true，则仅获取来自突出显示单元格的数据。 如果为 false，则获取所有单元格的数据。 默认：假。
     * @param processed - 如果为 false，则返回是使用单元格的 innerHTML 构建的。 否则，它是使用 {@link WorksheetOptions.data} 属性构建的。 默认：假。
     * @param delimiter - 列分隔符。 如果指定了此属性，则结果将被格式化为 csv。
     * @param asJson - 如果此属性为 true，则结果将被格式化为 json。
     */
    getData: (
      highlighted?: boolean,
      processed?: boolean,
      delimiter?: string,
      asJson?: boolean
    ) => CellValue[][];

    /**
     * 从范围获取数据。
     * @param range - 其值要返回的单元格范围。
     * @param processed - 如果为 true，则方法返回单元格 HTML 元素的值。 否则，该方法返回 options.data 数组中单元格的值。
     */
    getDataFromRange: (range: string, processed: true) => CellValue[][];

    /**
     * 获取列标题。
     * @param column - 列索引。
     */
    getHeader: (column: number) => string;

    /**
     * 获取所有标题标题。
     * @param asArray - 如果为 true，则返回数组中的项目，如果为 false，则返回它们在单个字符串中用“;”分隔。
     */
    getHeaders: (asArray?: boolean) => string | string[];

    /**
     * 获取所有行的高度。
     */
    getHeight(row?: undefined): string[];

    /**
     * 获取一行的高度。
     * @param row - 列索引。
     */
    getHeight(row: number): string;

    /**
     * 获取突出显示选择的坐标。
     */
    getHighlighted: () => [number, number, number, number][];

    /**
     * 获取单元格的 innerHTML。
     * @param cell - 单元格名称。
     */
    getLabel(cell: string): string;

    /**
     * 获取单元格的 innerHTML。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     */
    getLabel(x: number, y: number): string;

    /**
     * 获取一个或所有合并单元格的信息
     * @param cellName - 单元格名称。 如果它是一个假值，它返回所有合并的信息。 如果给定的单元格不是合并的锚点，则返回 null。
     */
    getMerge(
      cellName?: string
    ): Record<string, [number, number]> | [number, number] | null;

    /**
     * 从一个或所有单元格获取元信息。
     * @param cell - 单元格名称。 如果它是一个假值，则返回所有单元格的元数据。
     */
    getMeta: (cell?: string) => any;

    /**
     * 获取所选单元格范围的描述。
     */
    getRange: () => string;

    /**
     * 按索引获取一行的数据。
     * @param rowNumber - 行索引。
     * @param processed - 如果为 true，则返回是使用单元格的 innerHTML 构建的。 否则，它是使用 {@link WorksheetOptions.data} 属性构建的。 默认：假。
     */
    getRowData: (
      rowNumber: number,
      processed?: boolean
    ) => CellValue[] | undefined;

    /**
     * 获取工作表中选定单元格的信息。
     * @param columnNameOnly - 如果为 true，则方法返回选定单元格的名称。 否则，该方法返回选定单元格的记录。
     */
    getSelected: (columnNameOnly?: boolean) =>
      | {
          element: HTMLTableCellElement[][];
          x: number;
          y: number;
        }[]
      | string[];

    /**
     * 获取具有突出显示单元格的列的索引。
     * @param visibleOnly - 如果为 true，则该方法仅返回可见列。
     */
    getSelectedColumns: (visibleOnly?: boolean) => number[];

    /**
     * 获取具有突出显示单元格的行的索引。
     * @param visibleOnly - 如果为 true，则该方法仅返回可见行。
     */
    getSelectedRows: (visibleOnly?: boolean) => number[];

    /**
     * 获取工作表中选定范围的坐标。
     */
    getSelection: () => [number, number, number, number];

    /**
     * 从一个或所有单元格获取样式。
     * @param cell - 单元格的名称或坐标。 如果省略，则返回所有单元格的样式。
     * @param key - 样式属性。 如果指定，则仅返回该属性。 否则，它返回单元格的所有样式属性。
     */
    getStyle: (
      cell?: string | [number, number],
      key?: string
    ) => string | Record<string, string>;

    /**
     * 获取单元格的值。
     * @param cell - 单元格名称。
     * @param processedValue - 如果为 true，则返回单元格的 innerHTML。 否则，它返回 {@link WorksheetOptions.data} 属性中单元格的值。
     */
    getValue: (cell: string, processedValue?: boolean) => CellValue | null;

    /**
     * 按坐标获取单元格的值。
     * @param x - 列索引。
     * @param y - 行索引。
     * @param processedValue - 如果为 true，则返回单元格的 innerHTML。 否则，它返回 {@link WorksheetOptions.data} 属性中单元格的值。
     */
    getValueFromCoords: (
      x: number,
      y: number,
      processedValue?: boolean
    ) => CellValue | null;

    /**
     * 获取一个或所有列的宽度。
     * @param column - 列的索引。 如果省略，则返回所有列的宽度。
     */
    getWidth: (column?: number) => number | (number | string)[];

    /**
     * 获取当前活动工作表的索引
     */
    getWorksheetActive: () => number;

    /**
     * @deprecated
     */
    hashString: null | number;

    /**
     * 对应于标题行的 HTML 元素。
     */
    headerContainer: HTMLTableRowElement;

    /**
     * 组成标题的单元格列表。
     */
    headers: HTMLTableCellElement[];

    /**
     * 隐藏列。
     * @param colNumber - 列索引。
     */
    hideColumn: (colNumber: number | number[]) => void;

    /**
     * 隐藏行数列。
     */
    hideIndex: () => void;

    /**
     * 隐藏行。
     * @param rowNumber - 行索引。
     */
    hideRow: (rowNumber: number | number[]) => void;

    /**
     * 突出显示的单元格列表。
     */
    highlighted: {
      element: HTMLTableCellElement;
      x: number;
      y: number;
    }[];

    /**
     * 在工作表上执行的操作列表。
     */
    history: HistoryRecord[];

    /**
     * {@link WorksheetInstance.history} 属性的当前位置。 用于控制历史的运动。
     */
    historyIndex: number;

    /**
     * 如果为 true，则“setHistory”方法不会在历史记录中创建新记录。
     */
    ignoreHistory: boolean;

    /**
     * 检查单元格是否在当前选择中。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     */
    isSelected: (x: number, y: number) => boolean;

    /**
     * 插入一个或多个列。
     *
     * 如果 {@link SpreadsheetOptions.onbeforeinsertcolumn} 事件返回 false 或“此操作将破坏任何现有的合并单元格。您确定吗？”对话框收到否定响应。
     * @param mixed - 要插入的列数。 它也可以是一个值数组，但在这种情况下，只插入一列，其数据基于数组项。 默认：1。
     * @param columnNumber - 用作插入参考的列的索引。 默认：最后一列。
     * @param insertBefore - 在参考列之前或之后插入新列。 默认：假。
     * @param properties - 新列属性。
     */
    insertColumn: (
      mixed?: number | CellValue[],
      columnNumber?: number,
      insertBefore?: boolean,
      properties?: Column[]
    ) => false | undefined;

    /**
     * 插入一个或多个行。
     *
     * 如果 {@link SpreadsheetOptions.onbeforeinsertrow} 事件返回 false 或“此操作将破坏任何现有的合并单元格。您确定吗？”或“此操作将清除您的搜索结果。您确定吗？”对话框收到否定响应。
     * @param mixed - 要插入的行数。 它也可以是一个值数组，但在这种情况下，只插入一行，其数据基于数组项。 默认：1。
     * @param rowNumber - 用作插入参考的行的索引。 默认：最后一行。
     * @param insertBefore - 在参考行之前或之后插入新行。 默认：假。
     */
    insertRow: (
      mixed?: number | CellValue[],
      rowNumber?: number,
      insertBefore?: number
    ) => false | undefined;

    /**
     * 检查单元格是否为只读。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     */
    isReadOnly(x: number, y: number): boolean;

    /**
     * 检查单元格是否为只读。
     * @param cellName - 单元格名称。
     */
    isReadOnly(cellName: string): boolean;

    /**
     * 模拟 End 键的操作。
     * @param shiftKey - 如果为 true，则该方法模拟按下 Shift 键时 End 键的操作。
     * @param ctrlKey - 如果为 true，则该方法模拟按下 Ctrl 键时 End 键的操作。
     */
    last: (shiftKey?: boolean, ctrlKey?: boolean) => void;

    /**
     * 模拟“向左箭头”键的操作。
     * @param shiftKey - 如果为 true，则该方法模拟按下 Shift 键时“向左箭头”键的操作。
     * @param ctrlKey - 如果为 true，则该方法模拟按下 Ctrl 键时“向左箭头”键的操作。
     */
    left: (shiftKey?: boolean, ctrlKey?: boolean) => void;

    /**
     * 移动列。
     *
     * 如果“此操作将破坏任何现有的合并单元格。您确定吗？”对话框收到否定响应。
     * @param o - 列索引。
     * @param d - 新列索引。
     */
    moveColumn: (o: number, d: number) => false | undefined;

    /**
     * 移动一行。
     *
     * 如果“此操作将破坏任何现有的合并单元格。您确定吗？”或“此操作将清除您的搜索结果。您确定吗？”对话框收到否定响应。
     * @param o - 行索引。
     * @param d - 新行索引。
     */
    moveRow: (o: number, d: number) => false | undefined;

    /**
     * 开始编辑一个单元格。
     * @param cell - 单元格 HTML 元素。
     * @param empty - 如果为 true，即使单元格有内容，编辑器也会在没有内容的情况下打开。
     * @param event - 触发编辑器打开的 Js 事件。 此参数传递给自定义编辑器的“openEditor”方法。
     */
    openEditor: (
      cell: HTMLTableCellElement,
      empty?: boolean,
      event?: KeyboardEvent | MouseEvent | TouchEvent
    ) => void;

    /**
     * 打开列过滤器。
     *
     * 仅当 {@link WorksheetOptions.filters} 属性为 true 时，此方法才会运行。
     * @param columnId - 列索引。
     */
    openFilter: (columnId: number) => void;

    /**
     * 按索引打开工作表。
     * @param position - 工作表索引。
     */
    openWorksheet: (position: number) => void;

    /**
     * 电子表格设置。
     */
    options: WorksheetOptions;

    /**
     * 根据列中的值重新排序行。
     *
     * 如果“此操作将破坏任何现有的合并单元格。您确定吗？”对话框收到否定响应，或返回 true 如果排序成功。
     * @param column - 列索引。 如果此参数的值小于 0，则该方法返回 false 并且不执行排序。
     * @param order - 排序方向。 0 表示升序，1 表示降序。
     */
    orderBy: (column: number, order: 0 | 1) => boolean | undefined;

    /**
     * 转到页面。 仅当 {@link WorksheetOptions.pagination} 为 true 时有效。
     * @param pageNumber - 页码（从 0 开始）。
     */
    page: (pageNumber: number) => void;

    /**
     * 当前电子表格页面。
     */
    pageNumber: undefined | number;

    /**
     * 带有分页控件的 Div。
     */
    pagination: HTMLDivElement;

    /**
     * 组成此工作表的电子表格。
     */
    parent: SpreadsheetInstance;

    /**
     * 将内容粘贴到一个或多个单元格中。
     * @param x - 粘贴内容的单元格的列索引。
     * @param y - 粘贴内容的单元格的行索引。
     * @param data - 要粘贴的内容。
     */
    paste: (x: number, y: number, data: string) => false | undefined;

    /**
     * 获取工作表的页数。
     */
    quantiyOfPages: () => number;

    /**
     * 表示表格单元格的 HTML 元素列表。
     */
    records: {
      element: HTMLTableCellElement[][];
      x: number;
      y: number;
    }[][];

    /**
     * 重做先前撤消的操作
     */
    redo: () => void;

    /**
     * 删除合并。
     * @param cellName - 合并锚单元格。
     * @param data - 要放置在从合并中释放的单元格中的数据。
     */
    removeMerge: (cellName: string, data?: CellValue[]) => void;

    /**
     * 重置所有过滤器。
     */
    resetFilters: () => void;

    /**
     * 重置搜索
     */
    resetSearch: () => void;

    /**
     * 重置突出显示的单元格选择。
     * @returns 如果有突出显示的单元格，则返回 1，否则返回 0。
     */
    resetSelection: () => 0 | 1;

    /**
     * 重置一个或多个单元格的样式。
     * @param o - 键是必须重置其样式的单元格名称的对象。
     * @param ignoreHistoryAndEvents - 如果为 true，则不会将此操作添加到历史记录中。
     */
    resetStyle: (
      o: Record<string, any>,
      ignoreHistoryAndEvents?: boolean
    ) => void;

    /**
     * 有关当前调整大小的行或列的信息。
     */
    resizing: undefined | null | ResizeRowInfo | ResizeColumnInfo;

    /**
     * 包含搜索文本的行的索引。
     */
    results: null | number[];

    /**
     * 模拟“向右箭头”键的操作。
     * @param shiftKey - 如果为 true，则该方法模拟按下 Shift 键时“向右箭头”键的操作。
     * @param ctrlKey - 如果为 true，则该方法模拟按下 Ctrl 键时“向右箭头”键的操作。
     */
    right: (shiftKey?: boolean, ctrlKey?: boolean) => void;

    /**
     * 组成表格的行列表。
     */
    rows: {
      element: HTMLTableRowElement;
      y: number;
    }[];

    /**
     * 搜索一些文本。
     * @param query - 要搜索的文本。
     */
    search: (query: string) => void;

    /**
     * 用于执行搜索的文本字段。
     */
    searchInput: HTMLInputElement;

    /**
     * 选择所有表格单元格。
     */
    selectAll: () => void;

    /**
     * 当前选择坐标。
     *
     * 该数组分别由选择的最左列的索引 [0]、选择的最上行的索引 [1]、选择的最右列的索引 [2] 和选择的最下行的索引 [3] 组成。
     */
    selectedCell:
      | undefined
      | null
      | [number, number, number, number]
      | [string, string, string, string];

    selectedContainer: undefined | null | [number, number, number, number];

    /**
     * 当前具有“自动完成选择”的单元格。
     */
    selection: HTMLTableCellElement[];

    /**
     * 按索引设置一列的数据。
     * @param colNumber - 列索引。
     * @param data - 新数据。 值为 null 的位置不会在表中更改。
     * @param force - 如果为 true，则该方法还会更改只读列的内容。
     */
    setColumnData: (
      colNumber: number,
      data: (CellValue | null)[],
      force?: boolean
    ) => void;

    /**
     * 设置或删除注释。
     * @param cellId - 单元格的名称。
     * @param comments - 新评论。 如果它是一个假值，该方法只会取消注释单元格。
     */
    setComments(cellId: string, comments: string): void;

    /**
     * 设置或删除注释。
     * @param cellId - 键是单元格名称，值是单元格注释的对象。 如果键的值是一个假值，则删除单元格注释。
     */
    setComments(cellId: Record<string, string>): void;

    /**
     * 更改工作表或电子表格设置。
     * @param config - 新设置。
     * @param spreadsheetLevel - 如果为 true，则设置应用于电子表格。 如果没有，它们会应用于工作表。
     */
    setConfig: (config: SpreadsheetOptions, spreadsheetLevel?: boolean) => void;

    /**
     * 设置数据。
     * @param data - 新数据。 它可以是单元格值数组或值为单元格值的对象数组。
     */
    setData: (data?: CellValue[][] | Record<string, CellValue>[]) => void;

    /**
     * 设置列标题。
     * @param column - 列索引。
     * @param newValue - 新标题。 空字符串或未定义以重置标题标题。
     */
    setHeader: (column: number, newValue?: string) => void;

    /**
     * 更改行高。
     * @param row - 行索引。
     * @param height - 新高度。 大于零的整数。
     */
    setHeight: (row: number, height: number) => void;

    /**
     * 合并单元格。
     * @param cellName - 单元格的名称。 如果它是一个假值，此方法会合并表中选定的单元格并忽略此方法的所有参数。
     * @param colspan - 此合并占用的列数。
     * @param rowspan - 此合并占用的行数。
     * @returns 如果“cellName”参数是一个假值，并且表中没有选定的单元格，则此方法返回 null。
     */
    setMerge: (
      cellName?: string,
      colspan?: number,
      rowspan?: number
    ) => null | undefined;

    /**
     * 在单元格的元信息上设置一个属性。
     * @param o - 单元格名称。
     * @param k - 属性名称。
     * @param v - 属性值。
     */
    setMeta(o: string, k: string, v: string): void;

    /**
     * 删除当前并为一个或多个单元格定义新的元信息。
     * @param o - 具有新元信息的对象。
     */
    setMeta(o: Record<string, Record<string, any>>): void;

    /**
     * 更改单元格的只读状态。
     * @param cell - 单元格 HTML 元素或其名称。
     * @param state - 新的只读状态。
     */
    setReadOnly: (cell: string | HTMLTableCellElement, state: boolean) => void;

    /**
     * 按索引设置一行的数据。
     * @param rowNumber - 行索引。
     * @param data - 新数据。 值为 null 的位置不会在表中更改。
     * @param force - 如果为 true，则该方法还会更改只读列的内容。
     */
    setRowData: (
      rowNumber: number,
      data: (CellValue | null)[],
      force?: boolean
    ) => void;

    /**
     * 更改一个或多个单元格的单个样式。
     * @param o - 单元格的名称。
     * @param k - 要更改的属性。
     * @param v - 新的属性值。 如果等于属性的当前值并且“force”参数为 false，则从样式中删除该属性。
     * @param force - 如果为 true，则即使单元格是只读的也会更改属性的值。 此外，如果为 true，即使属性的新值与当前值相同，也不会删除该属性。
     */
    setStyle(o: string, k: string, v: string, force?: boolean): void;

    /**
     * 更改单元格样式。
     * @param o - 每个键是单元格名称，每个值是该单元格样式更改的对象。 每个值可以是一个带有分号分隔的 css 样式的字符串，也可以是一个数组，其中每个项目都是一个带有 css 样式的字符串。
     * @param k - 它没有被使用。
     * @param v - 它没有被使用。
     * @param force - 如果为 true，则即使单元格是只读的也会更改属性的值。 此外，如果为 true，即使属性的新值与当前值相同，也不会删除该属性。
     */
    setStyle(
      o: Record<string, string | string[]>,
      k?: null | undefined,
      v?: null | undefined,
      force?: boolean
    ): void;

    /**
     * 更改一个或多个单元格的值。
     * @param cell - 单元格的名称、表示单元格的 HTML 元素或其项目可以是前面任何替代项或对象的数组。 当数组项是一个对象时，它必须具有单元格坐标（“x”和“y”），并且可以具有单元格的新值（“value”），但如果没有，则使用“value”参数。
     * @param value - 新的单元格值。
     * @param force - 如果为 true，则更改只读单元格的值。
     */
    setValue: (
      cell:
        | string
        | HTMLTableCellElement
        | (
            | string
            | { x: number; y: number; value?: CellValue }
            | HTMLTableCellElement
          )[],
      value?: CellValue,
      force?: boolean
    ) => void;

    /**
     * 根据其坐标设置单元格值。
     * @param x - 单元格列索引。
     * @param y - 单元格行索引。
     * @param value - 新值。
     * @param force - 如果为 true，则更改只读单元格的值。
     */
    setValueFromCoords: (
      x: number,
      y: number,
      value: CellValue,
      force?: boolean
    ) => void;

    /**
     * 设置列的宽度。
     * @param column - 列索引。
     * @param width - 新宽度。
     */
    setWidth(column: number, width: number): void;

    /**
     * 设置一个或多个列的宽度。
     * @param column - 列索引。
     * @param width - 新宽度。
     */
    setWidth(column: number[], width: number | number[]): void;

    /**
     * 显示隐藏列。
     * @param colNumber - 列索引。
     */
    showColumn: (colNumber: number | number[]) => void;

    /**
     * 显示行数列。
     */
    showIndex: () => void;

    /**
     * 显示隐藏行。
     * @param rowNumber - 行索引。
     */
    showRow: (rowNumber: number | number[]) => void;

    /**
     * 复制的单元格样式。
     */
    style: string[];

    /**
     * 此 jss 实例的 HTML 表标签。
     */
    table: HTMLTableElement;

    /**
     * 此 jss 实例的 HTML tbody 标签。
     */
    tbody: HTMLTableSectionElement;

    /**
     * 复制单元格时内部使用的 HTML textarea 标签。
     */
    textarea: HTMLTextAreaElement;

    /**
     * 此 jss 实例的 HTML thead 标签。
     */
    thead: HTMLTableSectionElement;

    /**
     * 撤消上一个操作。
     */
    undo: () => void;

    /**
     * 模拟“向上箭头”键的操作。
     * @param shiftKey - 如果为 true，则该方法模拟按下 Shift 键时“向上箭头”键的操作。
     * @param ctrlKey - 如果为 true，则该方法模拟按下 Ctrl 键时“向上箭头”键的操作。
     */
    up: (shiftKey?: boolean, ctrlKey?: boolean) => void;

    /**
     * 选择单元格。
     * @param x1 - 选择的第一个单元格的列索引。 如果省略或为 null，则选择“y1”到“y2”行。
     * @param y1 - 选择的第一个单元格的行索引。 如果省略或为 null，则选择“x1”到“x2”列。
     * @param x2 - 选择的最后一个单元格的列索引。 默认：参数“x1”。
     * @param y2 - 选择的最后一个单元格的行索引。 默认：参数“y1”。
     */
    updateSelectionFromCoords: (
      x1: number | null,
      y1: number | null,
      x2?: number | null,
      y2?: number | null
    ) => false | undefined;

    /**
     * 获取行的页码。
     * @param cell - 行索引。
     */
    whichPage: (cell: number) => number;
  }

  type Version = () => {
    host: string;
    license: string;
    print: () => [string];
    type: string;
    version: string;
  };

  interface JssHelpers {
    /**
     * 从静态 HTML 元素中提取创建新电子表格的配置。
     * @param element - 表格元素。
     * @param options - 工作表选项。
     */
    createFromTable: (
      element: HTMLTableElement,
      options: WorksheetOptions
    ) => WorksheetOptions;

    /**
     * 内部方法。
     */
    getCaretIndex: (e: any) => number;

    /**
     * 根据索引获取列字母。
     * @param i - 列索引。
     */
    getColumnName: (i: number) => string;

    /**
     * 根据列和行索引获取“A1”样式坐标。
     * @param x - 列索引。
     * @param y - 行索引。
     */
    getCellNameFromCoords: (x: number, y: number) => string;

    /**
     * 根据“A1”样式的坐标获取列和行索引。
     * @param columnName - “A1”样式的坐标。
     */
    getCoordsFromCellName: (
      columnName: string
    ) => [number, number | null] | undefined;

    /**
     * 从范围获取坐标。
     * @param range - “A1:B2”样式的范围。
     * @returns 数组填充范围内第一个和最后一个单元格的 x 和 y 坐标。
     */
    getCoordsFromRange: (range: string) => [number, number, number, number];

    /**
     * 内部方法。
     */
    invert: (o: object) => any[] & Record<string, any>;

    /**
     * 将 CSV 字符串解析为 JS 数组。
     * @param str - csv 格式的文本。
     * @param delimiter - Csv 分隔符。
     */
    parseCSV: (str: string, delimiter?: string) => string[][];
  }

  interface JSpreadsheet {
    (
      element: HTMLDivElement | HTMLTableElement,
      options: SpreadsheetOptions
    ): WorksheetInstance[];

    /**
     * jss 的当前实例。
     */
    current: null | WorksheetInstance;

    /**
     * 销毁 jss 的实例。
     * @param element - jss 实例的根元素。
     * @param destroyEventHandlers - 删除事件监听器。 默认：假。
     */
    destroy: (
      element: JspreadsheetInstanceElement,
      destroyEventHandlers?: boolean
    ) => void;

    /**
     * 销毁所有 jss 实例。
     */
    destroyAll: () => void;

    /**
     * 按名称和命名空间获取工作表实例。
     * @param worksheetName - 搜索的工作表的名称。 如果为 null 或 undefined，则该方法返回找到的命名空间。
     * @param namespace - 命名空间名称。
     */
    getWorksheetInstanceByName: (
      worksheetName: string | null | undefined,
      namespace: string
    ) => WorksheetInstance | Record<string, WorksheetInstance>;

    helpers: JssHelpers;

    /**
     * 内部方法。
     */
    isMouseAction: boolean;

    /**
     * 定义翻译。
     * @param o - 翻译。
     */
    setDictionary: (o: Record<string, string>) => void;

    spreadsheet: SpreadsheetInstance[];

    /**
     * 内部方法。
     */
    timeControl: null | number;

    /**
     * 内部方法。
     */
    timeControlLoading: null | number;

    /**
     * 基本版本信息。
     */
    version: Version;

    [key: string]: any;
  }
}
