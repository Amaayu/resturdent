export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6">Disclaimer</h1>
          
          <div className="prose max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-3">General Information</h2>
              <p>
                The information provided by our restaurant ordering platform is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Restaurant Information</h2>
              <p>
                Restaurant menus, prices, hours of operation, and availability are subject to change without notice. We strive to keep all information up-to-date, but we cannot guarantee that all details are current at all times. Please contact the restaurant directly for the most accurate information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Food Allergies and Dietary Restrictions</h2>
              <p>
                While we provide information about menu items, we cannot guarantee the accuracy of allergen information or dietary specifications. If you have food allergies or dietary restrictions, please contact the restaurant directly before placing your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Delivery and Order Fulfillment</h2>
              <p>
                Delivery times are estimates and may vary based on various factors including weather, traffic, and restaurant preparation time. We are not responsible for delays in delivery or order fulfillment issues that are beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Payment and Transactions</h2>
              <p>
                Our platform currently supports Cash on Delivery (COD) and pay-at-restaurant options. We are not responsible for any disputes regarding payment or transactions between customers and restaurants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Limitation of Liability</h2>
              <p>
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Changes to This Disclaimer</h2>
              <p>
                We reserve the right to make changes to this disclaimer at any time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
