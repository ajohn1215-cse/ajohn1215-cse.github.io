import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold text-sbu-navy mb-8">About FindMySpot</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">What is FindMySpot?</h2>
          <p className="text-gray-700">
            FindMySpot is a modern web application designed to help Stony Brook University students,
            faculty, staff, and visitors find available parking spots across campus in real-time.
            Our goal is to make parking easier and reduce the time spent searching for a spot.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Parking Permit Requirements</h2>
          <p className="text-gray-700 mb-4">
            <strong>Important:</strong> Before you park on campus, please remember that unless you are a visitor to the University, 
            your vehicle must be registered and properly display a valid parking permit that has been issued by Parking Services.
          </p>
          <p className="text-gray-700">
            Full Parking Rules and Regulations can be viewed on the{' '}
            <a
              href="https://www.stonybrook.edu/mobility-and-parking/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sbu-red hover:underline"
            >
              Mobility & Parking Services (MAPS)
            </a>{' '}
            website.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Evening/Weekend Parking</h2>
          <p className="text-gray-700 mb-4">
            Lots are generally unrestricted and available for anyone to park from <strong>4pm to 7am, Monday-Friday</strong>, 
            and <strong>at all times Saturday & Sunday</strong> unless otherwise noted.
          </p>
          <p className="text-gray-700">
            <strong>Always check for signs at parking lot entrances</strong> for any restrictions.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Metered Parking Rates</h2>
          <div className="bg-blue-50 border-l-4 border-sbu-blue p-4 mb-4">
            <h3 className="text-lg font-semibold text-sbu-navy mb-3">💵 Price & Enforcement Hours</h3>
            <p className="text-gray-700 mb-3">
              <strong>Rate:</strong> <span className="text-lg font-bold text-sbu-red">$2.50 per hour</span>
            </p>
            <p className="text-gray-700">
              <strong>Enforcement Hours:</strong> <span className="font-semibold">Monday to Friday, 7:00 AM to 7:00 PM</span>
            </p>
            <p className="text-gray-600 text-sm mt-3">
              Meters are enforced on all metered parking lots. Outside of enforcement hours and on weekends, metered spaces are available at no charge.
            </p>
          </div>
          <p className="text-gray-700">
            Look for the <strong>💰 Metered</strong> indicator on parking lots in the app to identify metered spaces. 
            Plan accordingly and bring coins or payment methods for daytime parking.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Areas Enforced 24/7</h2>
          <p className="text-gray-700 mb-4">
            Please note that the following lots/parking spaces are restricted and enforced at all times:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>ADA accessible parking spaces</strong> - All accessible spaces are enforced 24/7</li>
            <li>
              <strong>Any lot marked as "Restricted 24 Hour Parking"</strong> which includes:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Faculty/Staff lot located next to the Computer Center</li>
                <li>Faculty/Staff lot located next to the Math/Physics building</li>
                <li>Faculty/Staff lot located on Lake Drive</li>
                <li>Faculty/Staff lot located next to the Student Health Center</li>
                <li>Faculty/Staff lot located next to the Automotive Repair Facility</li>
              </ul>
            </li>
            <li><strong>Life Sciences 1, Life Sciences 2, and Simons Center Zones</strong></li>
            <li><strong>All three parking garages:</strong> HSC Garage, Hospital Garage, and Administration Garage</li>
            <li>
              <strong>Any non-garage or non-metered spot.</strong> A valid permit is required in any parking space 
              that is not within a parking garage or a metered lot.
            </li>
          </ol>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Fall Session Parking</h2>
          <p className="text-gray-700 mb-4">
            <strong>Fall session parking begins and follows the standard academic calendar.</strong>
          </p>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-sbu-navy mb-2">Commuter Students</h3>
            <p className="text-gray-700 mb-2">
              During the fall session, commuter students may park in the following lots. Vehicles must display a valid parking permit, 
              either a Commuter Premium or Commuter Standard permit.
            </p>
            <p className="text-gray-700 font-semibold">
              Lots: 2, 3, 5, 6, 40, as well as residential student zones 1 through 5
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-sbu-navy mb-2">Resident Students</h3>
            <p className="text-gray-700">
              Any residential zone permit is good for residential zones 1-5.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">How FindMySpot Works</h2>
          <p className="text-gray-700 mb-4">
            FindMySpot displays parking availability information for lots and garages across the
            Stony Brook University campus. You can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Browse all available parking lots and garages</li>
            <li>See real-time availability counts</li>
            <li>Filter by lot type, amenities, and tags</li>
            <li>View individual spots and sections (faculty, student, paid meter)</li>
            <li>View locations on an interactive map</li>
            <li>Get directions to your chosen lot</li>
            <li>See enforcement hours and restrictions for each lot</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Data & Accuracy</h2>
          <p className="text-gray-700 mb-4">
            <strong>Important:</strong> This is a demonstration application. The parking availability
            data shown is for demonstration purposes only and may not reflect actual real-time
            conditions.
          </p>
          <p className="text-gray-700">
            For official parking information, regulations, and permits, please visit the{' '}
            <a
              href="https://www.stonybrook.edu/mobility-and-parking/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sbu-red hover:underline"
            >
              Mobility & Parking Services (MAPS)
            </a>{' '}
            website.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Governance</h2>
          <p className="text-gray-700">
            FindMySpot is designed to support the Stony Brook University community. Parking
            regulations, permits, and enforcement are managed by{' '}
            <a
              href="https://www.stonybrook.edu/mobility-and-parking/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sbu-red hover:underline"
            >
              MAPS - Mobility & Parking Services
            </a>
            . Always follow official parking rules and regulations.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-sbu-navy mb-4">Accessibility</h2>
          <p className="text-gray-700">
            FindMySpot is designed with accessibility in mind, following WCAG AA guidelines. If
            you encounter any accessibility issues, please report them so we can improve the
            experience for all users.
          </p>
        </section>

        <div className="mt-8">
          <Link to="/lots" className="btn-primary inline-block">
            Browse Parking Lots
          </Link>
        </div>
      </div>
    </main>
  );
}
