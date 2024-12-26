import { TableColumn } from "@backstage/core-components/index";
import { MetadataActors } from "../../types";
import makeStyles from "@material-ui/core/styles/makeStyles";

export const columns: TableColumn<MetadataActors>[] = [
    {
      title: 'Type',
      field: 'type',
      type: 'string',
      highlight: true,
    },
    {
        title: 'Count',
        field: 'count',
        type: 'numeric',
        highlight: true,
    }
    
]

export const useStyles = makeStyles(theme => ({
    empty: {
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
    },
  }));