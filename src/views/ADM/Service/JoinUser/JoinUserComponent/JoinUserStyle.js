import { makeStyles } from "@material-ui/core"

export const searchStyle = makeStyles(theme => ({
  searchCard:{
   padding: '0.8em' ,
   overflow:"visible",
   '& form':{
    justifyContent: 'space-between', 
    display: 'flex'
   }
  },
  searchInputBox:{
   width: '60%'
  },
  button:theme.searchBtn,
  w490searchCard:{
    padding: '0.8em' ,
    height:"100%",
   '& form':{
   }
  },
  w490button:{
      width:"100%",
      marginTop:"1em"
  },
 
  }))

  export const tableStyle = makeStyles(theme => ({
    topBarBox:{
      display: "flex",
      alignItems: "center",
      justifyContent:" space-between",
      width: "100%",
      height: "40px",
      backgroundColor: "#ffffff",
      border: "1px solid #babfc7",
      ...theme.tableText
    }
  }))
  export const detailStyle = makeStyles(theme => ({
    detailBox:{
      position: 'relative', 
      zIndex: 1,
    '& h5':theme.detailTitle
    },
    button:theme.detailBtn,
    detailHeader:{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
      },
    buttonBox:{
        width: '50%',
        marginRight: '1.4em',
        marginTop: '0.5em',
        justifyContent: 'flex-end',
        display: 'flex',
      },
      inputBox:{
        width: '100%',
        position: 'relative',
        justifyContent: 'space-between',
        display: 'flex',
        padding:"1em"
      },
      inputGridBox:{
          width:'100%',
          display: 'flex'
        },
        w750inputBox:{
          marginTop:"1em",
          width: '100%',
          position: 'relative',
          padding:"1em"
        },
        w490buttonBox:{
          display:"flex",
          marginTop:"1em",
          marginRight:"1em"
        }
  }))