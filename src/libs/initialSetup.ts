import Role from '../models/role.models';
import Type from '../models/type.models';

export const createRolesAndEventTypes = async () => {
try{
    const count = await Role.estimatedDocumentCount();
    const countEventTypes = await Type.estimatedDocumentCount();
    if(count > 0) return;

    const values = await Promise.all([
        new Role({name: 'assistant'}).save(),
        new Role({name: 'organizer'}).save()
    ]);

    if (countEventTypes > 0) return;
    const eventTypes = await Promise.all([
      new Type({ name: 'conference' }).save(),
      new Type({ name: 'seminar' }).save(),
      new Type({name: 'congress'}).save(),
    ]);
  
    console.log(eventTypes);
    console.log(values);
}catch(error){
    console.error(error);
}
};