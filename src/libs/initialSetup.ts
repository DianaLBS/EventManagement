import Role from '../models/role.models';
import Type from '../models/type.models';
export const createRoles = async () => {
  const count = await Role.estimatedDocumentCount();

  if(count > 0) return;

  await Promise.all([
      new Role({name: 'assistant'}).save(),
      new Role({name: 'organizer'}).save()
  ]);
};

export const createEventTypes = async () => {
  const count = await Type.estimatedDocumentCount();

  if(count > 0) return;

  await Promise.all([
      new Type({ name: 'conference' }).save(),
      new Type({ name: 'seminar' }).save(),
      new Type({name: 'congress'}).save(),
  ]);
};