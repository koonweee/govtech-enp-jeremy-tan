import Paper from '@material-ui/core/Paper';
import { styles } from '../utils/theme';
import { URLForm } from '@/components/URLForm';
import { useState } from 'react';
import { Box, CssBaseline, Grid } from '@material-ui/core';

export default function Home(): JSX.Element {
  const classes = styles();
  const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const [shortenedPath, setShortenedPath] = useState<string | undefined>(undefined);
  const [aliasError, setAliasError] = useState<boolean>(false);
  return (
    <div className={classes.container}>
      <CssBaseline />
      <Paper elevation={3} className={classes.paper}>
          <URLForm onSubmit={setShortenedPath} onError={setAliasError}/>
        {shortenedPath && (
          <div className={classes.result}>
            <a href={`${baseUrl}/${shortenedPath}`}>{`${baseUrl}/${shortenedPath}`}</a>
          </div>
        )}
        {aliasError && (
          <div className={classes.result}>
            {`Custom alias: ${shortenedPath} has already been used`}
          </div>
        )}
      </Paper>
    </div>
  )
}
