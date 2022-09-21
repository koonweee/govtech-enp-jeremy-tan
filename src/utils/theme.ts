import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const styles = makeStyles((theme: Theme) =>
createStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  result: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textAlign: 'center',
  },
  paper: {
    marginTop: theme.spacing(10),
    margin: `${theme.spacing(0)} auto`,
    padding: theme.spacing(1),
    width: 600,
  }
})
);
