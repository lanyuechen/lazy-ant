const program = require('commander');
const path = require('path');
const fs = require('fs');

const { tpl, writeFile, toUpperFirstCase } = require('../utils/common');

program
  .command('add <name>')
  .description('add a page, includes a model, a service, a mockup and a page entry')
  .option('-s, --src [path]', 'src路径', './')
  .option('-o, --option <path>', 'option路径', './option.json')
  .action(addHandler);

function addHandler (name, args) {
  const { src, option } = args;

  let opt = fs.readFileSync(option, 'utf8');
  opt = JSON.parse(opt);
  opt = {
    ...opt,
    columns: opt.columns.map(column => {
      if (typeof(column) === 'string') {
        return {
          title: toUpperFirstCase(column),
          dataIndex: column,
        }
      }
      return {
        ...column,
        title: column.title || toUpperFirstCase(column.dataIndex),
      };
    }),
  };

  const context = { name, opt };
  const nameCapital = name[0].toUpperCase() + name.substring(1);

  // 创建model
  writeFile(path.join(src, `models/${name}.ts`), tpl('model.njk', context));
  // 创建service
  writeFile(path.join(src, `services/${name}.ts`), tpl('service.njk', context));
  // 创建page
  writeFile(path.join(src, `pages/${nameCapital}/index.tsx`), tpl('pages/index.njk', context));
  // 创建ModalUpsert
  writeFile(path.join(src, `pages/${nameCapital}/ModalUpsert.tsx`), tpl('pages/modal-upsert.njk', context));
  // 创建mock
  writeFile(path.join(src, `../mock/${name}.ts`), tpl('mock.njk', context));
  // 创建utils/sorter
  writeFile(path.join(src, `utils/table/sorter.ts`), tpl('utils/sorter.njk', context));
  // 创建utils/filter
  writeFile(path.join(src, `utils/table/filter.tsx`), tpl('utils/filter.njk', context));
  // 创键文档
  
}