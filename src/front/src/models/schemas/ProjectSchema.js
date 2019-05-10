export default [
  {
    type: 'input',
    inputType: 'text',
    label: 'Название',
    model: 'name',
    placeholder: 'Название проекта',
    required: true,
  },
  {
    type: 'input',
    inputType: 'text',
    label: 'URL',
    model: 'url',
    placeholder: 'url для отслеживания доступности',
    required: true,
  },
  {
    type: 'input',
    inputType: 'textarea',
    label: 'Описание',
    model: 'text',
    placeholder: 'Краткое описание проекта',
    required: true,
  },
  {
    type: 'input',
    inputType: 'password',
    label: 'Password',
    model: 'password',
    min: 6,
    required: true,
    hint: 'Minimum 6 characters',
  },
  {
    type: 'checkbox',
    label: 'isActive',
    model: 'isActive',
    default: true,
  },
];
