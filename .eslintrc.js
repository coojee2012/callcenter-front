module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    'array-callback-return': 1, // 数组的方法除了 forEach 之外，回调函数必须有返回值: warning
    'arrow-body-style': 0, // 箭头函数能够省略 return 的时候，必须省略:off
    'camelcase': 0, // 规则查找:off
    'consistent-return': 0, // return语句总是或永远不指定值:off
    'generator-star-spacing': 0, // 强化*发生器功能的间距:off
    'global-require': 2, // 要求所有调用require()都位于模块的顶层:error
    'guard-for-in': 0, // 防止使用for in循环而不过滤循环中的结果时可能出现的意外行为:off
    'import/extensions': 0, // 禁止使用别名代替路径:off
    'import/no-extraneous-dependencies': 0, // 禁止使用别名代替路径:off
    'import/no-unresolved': 0, // 禁止使用别名代替路径:off
    'import/prefer-default-export': 0, // 只有一个export时必须default:off
    'indent': [2, 2, { SwitchCase: 1 }], // 2个缩进, switch也使用缩进:error
    'jsx-a11y/anchor-is-valid': 0, // 锚点必须有效:off
    'jsx-a11y/click-events-have-key-events': 0, // 点击事件必须有key:off
    'jsx-a11y/label-has-associated-control': 0, // 标签必须有关联:off
    'jsx-a11y/label-has-for': 0, // 标签必须for:off
    'jsx-a11y/mouse-events-have-key-events': 0, // 鼠标事件必须有key:off
    'jsx-quotes': [1, 'prefer-single'], // 强制单引号:warning
    'linebreak-style': 0, // 强制执行统一的行结尾:off
    'max-len': 0, // 限制1行的长度:off
    'no-bitwise': 0, // 禁止使用位运算:off
    'no-case-declarations': 0, // 防止访问未初始化的词汇绑定以及跨越事例子句访问提升的功能:off
    'no-console': 0, // 禁止使用console:off
    'no-else-return': 0, // 禁止在 else 内使用 return，必须改为提前结束:off
    'no-nested-ternary': 0, // 禁止使用三元表达式:off
    'no-plusplus': 0, // 禁止使用++ --:off
    'no-restricted-syntax': 0, // 禁止使用特定语法:off
    'no-script-url': 0, // url格式:off
    'no-shadow': 1, // 禁止变量名与上层作用域内的定义过的变量重复:warning
    'no-underscore-dangle': 0, // 不允许在标识符中使用悬空下划线:off
    'no-unused-expressions': [0], // 消除对程序状态没有影响的未使用的表达式:off
    'no-unused-vars': 1, // 定义过的变量必须使用:warning
    'object-curly-newline': [1, { consistent: true, minProperties: 5 }], // 大括号结尾内容超过5个必须换行:warning
    'prefer-destructuring': 2, // array和object，可用于打开或关闭每一个这些类型独立的解构要求:error
    'react/destructuring-assignment': 0, // 需要使用变量解构方式对变量进行赋值:off
    'react/forbid-prop-types': 0, // 禁止使用一些指定的 propType:off
    'react/jsx-indent': [2, 2], // jsx 的 children 缩进必须为2个空格:error
    'react/jsx-indent-props': [2, 2], // jsx 的 props 缩进必须为2个空格:error
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }], // 限制文件后缀:warning
    'react/jsx-one-expression-per-line': 0, // 元素里面的内容必须另起一行:off
    'react/jsx-tag-spacing': 0, // 单行元素必须以空格结尾:off
    'react/no-array-index-key': 0, // 禁止使用数组的index为key:off
    'react/no-multi-comp': 2, // 禁止在一个文件创建两个组件:error
    'react/prefer-stateless-function': 0, // 必须使用pure function:off
    'react/prop-types': 0, // 组件必须写 propTypes:off
    'require-yield': 1, // generator 函数内必须有 yield:warning
    'spaced-comment': 0, // 注释符号中必须接空格:off
  },
};
