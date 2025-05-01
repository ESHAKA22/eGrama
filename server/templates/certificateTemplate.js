module.exports = function generateCertificateHTML(user) {
  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 3px double #333; background-color: #fff;">
      <!-- Certificate Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://example.com/village-seal.png" alt="Village Seal" style="height: 100px; margin-bottom: 10px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #2c3e50;">OFFICIAL CHARACTER CERTIFICATE</h1>
        <p style="font-size: 16px; margin: 5px 0 0; color: #7f8c8d;">Issued by the Village Management System</p>
      </div>

      <!-- Certificate Body -->
      <div style="margin: 20px 0; line-height: 1.6; font-size: 16px;">
        <p style="text-align: justify; text-indent: 50px;">
          This is to certify that <strong style="color: #2c3e50;">${user.firstName} ${user.lastName}</strong>, 
          holder of National Identification Card No. <strong>${user.identificationNumber}</strong>, 
          residing at <strong>${user.villageAddress}</strong>, is a bonafide resident of our village 
          and is known to be a respectable and law-abiding citizen.
        </p>

        <div style="margin: 25px 0 25px 50px;">
          <p style="margin: 8px 0;"><strong style="width: 200px; display: inline-block;">Date of Birth:</strong> ${new Date(user.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin: 8px 0;"><strong style="width: 200px; display: inline-block;">Marital Status:</strong> ${user.maritalStatus}</p>
          <p style="margin: 8px 0;"><strong style="width: 200px; display: inline-block;">Community Participation:</strong> ${user.behavior?.villageContribution || "Active and cooperative"}</p>
          <p style="margin: 8px 0;"><strong style="width: 200px; display: inline-block;">Living Conditions:</strong> ${user.behavior?.livingConditions || "Satisfactory"}</p>
          <p style="margin: 8px 0;"><strong style="width: 200px; display: inline-block;">Criminal Record:</strong> ${user.criminalRecord?.hasRecord ? "Yes" : "No"}</p>
          ${user.criminalRecord?.hasRecord ? `<p style="margin: 8px 0 8px 200px;"><strong>Details:</strong> ${user.criminalRecord.details || "N/A"}</p>` : ''}
        </div>

        <p style="text-align: justify; text-indent: 50px;">
          This certificate is issued upon request for official purposes and confirms that the above-named 
          individual has maintained good standing within our community during their period of residence.
        </p>
      </div>

      <!-- Certificate Footer -->
      <div style="margin-top: 50px;">
        <div style="float: right; text-align: center; width: 300px;">
          <div style="border-top: 1px solid #333; width: 200px; margin: 0 auto; padding-top: 5px;">
            <strong>Gramaniladhari Officer</strong><br>
            Village Management System
          </div>
        </div>

        <div style="clear: both;"></div>

        <p style="text-align: center; margin-top: 20px; font-style: italic; color: #7f8c8d;">
          Issued on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #95a5a6;">
          <p>Certificate ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          <p>This document is valid only with the official seal and signature</p>
        </div>
      </div>
    </div>
  `;
};
  