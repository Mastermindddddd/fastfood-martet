"use client"

import MapboxAddressInput from "./MapboxAddressInput";

export default function AddressInputs({addressProps,setAddressProp,disabled=false}) {
  const {phone, streetAddress, postalCode, city, country} = addressProps;
  
  const handleAddressSelect = (addressData) => {
    if (addressData.streetAddress) {
      setAddressProp('streetAddress', addressData.streetAddress);
    }
    if (addressData.city) {
      setAddressProp('city', addressData.city);
    }
    if (addressData.postalCode) {
      setAddressProp('postalCode', addressData.postalCode);
    }
    if (addressData.country) {
      setAddressProp('country', addressData.country);
    }
  };

  return (
    <>
      <label>Phone</label>
      <input
        disabled={disabled}
        type="tel" placeholder="Phone number"
        value={phone || ''} onChange={ev => setAddressProp('phone', ev.target.value)} />
      
      <MapboxAddressInput
        value={streetAddress || ''}
        onChange={(value) => setAddressProp('streetAddress', value)}
        onSelect={handleAddressSelect}
        placeholder="Start typing your address..."
        disabled={disabled}
        label="Street address"
      />
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Postal code</label>
          <input
            disabled={disabled}
            type="text" placeholder="Postal code"
            value={postalCode || ''} onChange={ev => setAddressProp('postalCode', ev.target.value)}
          />
        </div>
        <div>
          <label>City</label>
          <input
            disabled={disabled}
            type="text" placeholder="City"
            value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
          />
        </div>
      </div>
      <label>Country</label>
      <input
        disabled={disabled}
        type="text" placeholder="Country"
        value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
      />
    </>
  );
}