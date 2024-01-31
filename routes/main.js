const express = require('express')

const fs =  require('fs')

const router = express.Router()

const db = require('../data.json')

const e = require('express')

router.get('/',(req,res)=>{
    if(db.length == 0){

        res.status(400).send('No hay usuarios en la base de datos')

    }else{
        res.status(200).send(db)
        
    }
})

router.get('/:id',(req,res)=>{
        let user = db.find(el => el.id == req.params.id)
    
        if(user == undefined){
            res.status(404).send('Usuario no encontrado.')
        }else{
            res.status(200).send(user)
        }

})



router.use((req,res,next)=>{
    try{
        if( req.body.nombre == "" || req.body.id == "" || Number( req.body.nombre) ){

            res.status(400).send('Datos enviados no validos.')
            

        }else if(req.body.nombre == undefined ||  req.body.id == undefined){

            res.status(400).send('Datos enviados no validos.')

        }else{

            next()
        }

    }catch(e){

        res.status(400).send('Datos enviados no validos.')

    }
})



router.post('/',(req,res)=>{
    try{
        if(db.find(el => el.id == req.body.id) != undefined || typeof req.body.id == "string"){

            res.status(400).send('El id solicitado ya esta en uso o no es valido.')

        }else{

            db.push(req.body)

            fs.writeFile('data.json',JSON.stringify(db),(error)=>{

                if(error){

                    res.status(404).send('No ha sido posible ingresar los datos en la base de datos.')

                }
            })
        }

        res.send(db)

    }catch(e){

        res.status(404).send('No ha sido posible ingresar los datos en la base de datos.')

    }
})

router.put('/',(req,res)=>{
    try{
        if(db.find(el => el.id == req.body.id) == undefined || typeof req.body.id == "string"){

            res.status(400).send('El id solicitado ya esta en uso o no es valido.')

        }

        const user = db.find(el => el.id == req.body.id)

        if(req.body.nombre == user.nombre){

            res.status(404).send('El nombre que has enviado ya esta registrado en este usuario.')

        }else if(user != undefined){

            db[db.indexOf(user)].nombre = req.body.nombre

            fs.writeFile('data.json',JSON.stringify(db),(error)=>{

                if(error){

                    res.status(404).send('No ha sido posible actualizar los datos en la base de datos.')

                }

            })

            res.status(200).send("Usuario actualizado")

        }else{

            res.status(404).send('Usuario no encontrado.')

        }
    }catch(e){

        res.status(404).send('No ha sido posible actualizar los datos en la base de datos.')

    }

})

router.delete('/',(req,res)=>{
    try{

        if(db.find(el => el.id == req.body.id && el.nombre == req.body.nombre) == undefined || typeof req.body.id == "string"){

            res.status(400).send('El id solicitado no es valido.')

        }else{

            const newDB = db.filter(el => el.id != req.body.id)

            fs.writeFile('data.json',JSON.stringify(newDB),(error)=>{

                if(error){

                    res.status(404).send('No ha sido posible eliminar los datos en la base de datos.')

                }
            })

            res.status(200).send("Usuario eliminado.")
        }

    }catch(e){

        res.status(404).send('No ha sido posible eliminar los datos en la base de datos.')
        
    }
})



module.exports = router
