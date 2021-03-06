const { makeStyles } = require("@material-ui/core");

export const searchStyle = makeStyles(theme => ({
    searchBox:{
      position: 'relative', 
      zIndex: 1,
    },
    searchCard:{
      padding: '0.8em' ,
      overflow:"visible",
      '& form':{
        justifyContent: 'space-between', 
        display: 'flex' 
      }
    },
    formBox:{
      width: '30%',
      marginRight:"5em",
     
    },
    formInputWidth:{
      width:"160px"
    },
   
    button:theme.searchBtn,
    w490searchCard:{
      padding: '0.8em' ,
      overflow:"visible",
      '& form':{
      }
    },
    w490button:{
      width:"100%",
      marginTop:"1em"
    }

  
    
  }))

 export const tableStyle = makeStyles(theme => ({
  
  button:theme.tableBtn,
  TopBarBox:{
   display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height:" 46px",
   
    backgroundColor: "#ffffff",
    border: "1px solid #babfc7",
    ...theme.tableText
  }
  }));

  export const detailStyle = makeStyles(theme => (
    
    {
      button:theme.detailBtn,
      detailsHeader: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
      },
      detailsHeaderTitle:theme.detailTitle,
      detailsBtnBox: {
        position:"relative",
        width: '50%',
        marginTop: '0.5em',
        marginRight: '1.4em',
        display: 'flex',
        justifyContent: 'flex-end',
    
      },
      inputCardContent: {
        width:"100%",
        height:"655px",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
      },
      w980inputCardContent:{
        width:"100%",
        height:"655px",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
      },
   
      contentBox: {
        width: '40%',
        overflow:"visible",
        marginRight:"5px",
      },
        contentTitle:{
          position: 'absolute',
          zIndex:"88",
          fontSize:"14px",
          top:"-5px",
          left:"30px",
          width:"50px",
          height:"10px",
          backgroundColor:"#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color:"#575757"
        },
        content:{
          fontSize:"13px",
        },
      
      W800detailBox:{
        marginBottom:"1em"
      },
      w800contentBox:{
        
        overflow:"visible",
        
      },
      w525detailsBtnBox:{
        marginLeft:"1em",
        marginTop:"1em"
      }
 
  }));