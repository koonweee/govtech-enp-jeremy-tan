import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const styles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 400,
    margin: `${theme.spacing(0)} auto`
  },
  result: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textAlign: 'center',
  },
  paper: {
    marginTop: theme.spacing(10),
    padding: theme.spacing(1)
  }
})
);
