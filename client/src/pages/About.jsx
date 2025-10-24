export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              Welcome to our restaurant discovery and online ordering platform. We connect food lovers with the best local restaurants in their area.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Our mission is to make it easy for everyone to discover and enjoy delicious food from local restaurants. We believe in supporting local businesses and providing customers with a seamless ordering experience.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Wide selection of restaurants and cuisines</li>
              <li>Easy-to-use ordering system</li>
              <li>Real-time order tracking</li>
              <li>Secure and convenient payment options</li>
              <li>Customer reviews and ratings</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> support@restaurant-app.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> 123 Food Street, Culinary City, FC 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
