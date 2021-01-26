import messgModel from './schema';

export async function saveToDB (req) {
  let msg = new messgModel(req);
  await msg.save(()=> {console.log('saved')
})
 
}
 export async function readDB(req) {
   messgModel.find(req, (error, data) =>{
    if(error){console.log(error)} else{
      console.log(data);
         
    }})
  
  
}

export async function readOneDB(ctx) {
    messgModel.findOne(ctx, (error, data) =>{
        if(error){console.log(error)} else{
          console.log(data)
        }
      })      
}

export async function readIdDB(ctx) {
    messgModel.findById(ctx, (error, data) =>{
        if(error){console.log(error)} else{
          console.log('data:', data)
        }
      })
                    
}

export async function updatedDB(ctx) {
    messgModel.findByIdAndUpdate(ctx, 
        {  $set:{
           title: ctx.title,
           body: ctx.body },
        timestamps: true},
         (error) =>{
       if(error){console.log(error)} 
    } ).then((result) => {console.log('new data:', result)})
               
}

export async function deleteDB(ctx) {
    messgModel.findByIdAndDelete(ctx, (error, data) =>{
        if(error){console.log(error)} else{
          console.log('deleted:', data)
        }
      })
                    
}
     

   
   
   