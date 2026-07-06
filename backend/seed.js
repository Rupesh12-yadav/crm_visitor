const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Visitor = require('./models/Visitor');

const initAdmin = async () => {
  try {
    const exists = await User.findOne({ email: 'admin@gmail.com' });
    if (!exists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({ email: 'admin@gmail.com', password: hashedPassword });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const seedCustomers = async () => {
  try {
    const count = await Customer.countDocuments();
    if (count > 0) {
      return;
    }

    const customers = [
        { name: 'Rohan Sharma', email: 'rohan.sharma@maruti.co.in', phone: '9876543210', company: 'Maruti Suzuki', status: 'active' },
        { name: 'Priya Patel', email: 'priya.patel@maruti.co.in', phone: '9876543211', company: 'Maruti Suzuki', status: 'active' },
        { name: 'Amit Singh', email: 'amit.singh@nexadealers.com', phone: '9876543212', company: 'Nexa Dealers', status: 'active' },
        { name: 'Sneha Gupta', email: 'sneha.gupta@marutiarena.com', phone: '9876543213', company: 'Maruti Arena', status: 'inactive' },
        { name: 'Vikram Rathod', email: 'vikram.rathod@truevalue.com', phone: '9876543214', company: 'Maruti True Value', status: 'active' },
        { name: 'Anjali Verma', email: 'anjali.verma@example.com', phone: '9123456780', company: 'Tech Solutions', status: 'active' },
        { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '9123456781', company: 'Innovate Inc', status: 'inactive' },
        { name: 'Sunita Devi', email: 'sunita.devi@example.com', phone: '9123456782', company: 'Global Exports', status: 'active' },
        { name: 'Manoj Tiwari', email: 'manoj.tiwari@example.com', phone: '9123456783', company: 'Creative Minds', status: 'active' },
        { name: 'Pooja Mehta', email: 'pooja.mehta@example.com', phone: '9123456784', company: 'HealthFirst', status: 'inactive' },
        { name: 'Sanjay Mishra', email: 'sanjay.mishra@example.com', phone: '9123456785', company: 'BuildCorp', status: 'active' },
        { name: 'Deepika Reddy', email: 'deepika.reddy@example.com', phone: '9123456786', company: 'Foodies', status: 'active' },
        { name: 'Arjun Nair', email: 'arjun.nair@example.com', phone: '9123456787', company: 'Logistics Pro', status: 'inactive' },
        { name: 'Kavita Joshi', email: 'kavita.joshi@example.com', phone: '9123456788', company: 'EduCare', status: 'active' },
        { name: 'Harish Iyer', email: 'harish.iyer@example.com', phone: '9123456789', company: 'FinanceFast', status: 'active' }
    ];

    await Customer.insertMany(customers);
    console.log('Sample customer data has been added.');

  } catch (error) {
    console.error('Error seeding customer data:', error);
  }
};

const seedVisitors = async () => {
    try {
        const count = await Visitor.countDocuments();
        if (count > 0) {
            return;
        }

        const visitors = [
            { visitorName: 'Test Visitor 1', phone: '1112223330', personToMeet: 'Rohan Sharma', purpose: 'Meeting', checkOutTime: new Date() },
            { visitorName: 'Test Visitor 2', phone: '1112223331', personToMeet: 'Priya Patel', purpose: 'Interview' },
            { visitorName: 'Test Visitor 3', phone: '1112223332', personToMeet: 'Amit Singh', purpose: 'Delivery' },
        ];

        await Visitor.insertMany(visitors);
        console.log('Sample visitor data has been added.');
    } catch (error) {
        console.error('Error seeding visitor data:', error);
    }
};

const seedAll = async () => {
  await initAdmin();
  await seedCustomers();
  await seedVisitors();
};

module.exports = { seedAll };