export default theme => ({
  root: {},
  body : {
    fontFamily : 'Roboto'
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  font : {
    fontFamily : 'Roboto'
  },
  deleteButton: {
    color: theme.palette.danger.main,
    marginRight: theme.spacing(1)
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  importIcon: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  exportIcon: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
});
