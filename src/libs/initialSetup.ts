import Role from '../models/role.models';

export const createRoles = async () => {
try{
    const count = await Role.estimatedDocumentCount();
    if(count > 0) return;

    const values = await Promise.all([
        new Role({name: 'assistant'}).save(),
        new Role({name: 'organizer'}).save()
    ]);
    console.log(values);
}catch(error){
    console.error(error);
}
};