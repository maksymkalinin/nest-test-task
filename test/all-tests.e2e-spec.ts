import carsDescribe from './cars.e2e';
import manufacturersDescribe from './manufacturers.e2e';
import ownersDescribe from './owners.e2e';

describe('All modules', () => {
  describe('Cars', carsDescribe);
  describe('Manufacturers', manufacturersDescribe);
  describe('Owners', ownersDescribe);
});
