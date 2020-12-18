const { makeStyles } = require("@material-ui/styles");


export const searchStyle = makeStyles(theme => ({
    searchCard:{
      padding: '0.8em'
    },
    formBox:{
      display:"flex",
      justifyContent: 'space-between',
      '& div':{
        width:"100%"
      }
    },
    
    button:theme.searchBtn,
    w490formBox:{
        '& div':{
            width:"100%"
          }
    },
    w490button:{
        width:"100%",
        marginTop:"1em",
    }

    
    
    }))
   export const tableStyle = makeStyles(theme => ({
        TopBarBox:{
          display: "flex",
           alignItems: "center",
           justifyContent: "space-between",
           width: "100%",
           height:" 46px",
           backgroundColor: "#ffffff",
           border: "1px solid #babfc7",
           ...theme.tableText
         },
         button:theme.tableBtn
      }));
      
export const detailStyle = makeStyles(theme => ({
    button:theme.detailBtn,
    detailBar:{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        '& h5':theme.detailTitle
      },
     detailBtnBox:{
        width: '50%',
        marginTop: '0.5em',
        marginRight: '1.4em',
        display: 'flex',
        justifyContent: 'flex-end'
      },
      inputBox:{
        display: 'flex',
        width: '100%',
        padding:"1em",
        position: 'relative',
        justifyContent: 'center'
      },
      w490detailBar:{
        '& h5':{
            fontSize: '1.2rem',
            color: '#2c3e50',
            marginLeft: '1em',
            marginTop: '0.5em'
          }
      },
      w490detailBtnBox:{
        width: '100%',
       padding:"1em",
        display: 'flex',
      },
      grid:{
          '& .ag-paging-panel':{
              height:"20px"
          }
      }
    
    }))