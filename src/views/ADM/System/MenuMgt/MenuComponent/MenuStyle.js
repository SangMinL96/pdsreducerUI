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
      width: '90%',
      marginRight:"5em",
     
    },
    formInputWidth:{
      width:"160px"
    },
    button:{
      width:"105px",
      height:"34px",
      marginRight:"0.7em"
    },
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
    button:{
    width: '100px', 
    marginRight: '1.75em',
 
 height:"30px"
  },
  TopBarBox:{
   display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height:" 46px",
   
    backgroundColor: "#ffffff",
    border: "1px solid #babfc7",
    '& div' :{
      fontSize: "1.05rem",
      fontWeight: "600",
    },
    '& h3':{
      fontSize: "1.02rem",
      fontWeight: "600",
      marginLeft: "1.1em",
      '& span': {
        marginLeft: "5px",
      }
    }
  }
  }));

  export const detailStyle = makeStyles(props => (
    
    {
      detailsHeader: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between'
      },
      detailsHeaderTitle: {
        fontSize: '1.2rem',
        color: '#2c3e50',
        marginLeft: '1em',
        marginTop: '0.5em'
      },
      detailsBtnBox: {
        position:"relative",
        width: '50%',
        marginTop: '0.5em',
        marginRight: '1.4em',
        display: 'flex',
        justifyContent: 'flex-end',
        '& Button': {
          width: '100px',
          marginLeft: '1em',
        
        }
      },
      inputCardContent: {
        display:'flex',
        width: '100%',
        justifyContent: 'space-between'
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