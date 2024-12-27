import { Checkbox, Slider, Input } from 'antd';
import { useState } from 'react';

const Sidebar = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  return (
    <div className="w-64 bg-white p-4 border-r">
      {/* Category Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          <Checkbox className="w-full">Restaurants</Checkbox>
          <Checkbox className="w-full">Hotels</Checkbox>
          <Checkbox className="w-full">Shops</Checkbox>
          <Checkbox className="w-full">Services</Checkbox>
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <Slider
          range
          min={0}
          max={10000}
          value={priceRange}
          onChange={(value: [number, number]) => setPriceRange(value)}
          className="mb-4"
        />
        <div className="flex items-center space-x-2">
          <Input
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            prefix="$"
            className="w-24"
          />
          <span>-</span>
          <Input
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            prefix="$"
            className="w-24"
          />
        </div>
      </div>

      {/* Email Status Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Email Status</h3>
        <div className="space-y-2">
          <Checkbox className="w-full">Not Sent</Checkbox>
          <Checkbox className="w-full">Sent</Checkbox>
          <Checkbox className="w-full">Failed</Checkbox>
        </div>
      </div>

      {/* Business Type Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Business Type</h3>
        <div className="space-y-2">
          <Checkbox className="w-full">Local Business</Checkbox>
          <Checkbox className="w-full">Chain</Checkbox>
          <Checkbox className="w-full">Franchise</Checkbox>
        </div>
      </div>

      {/* Apply Filter Button */}
      <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors">
        Apply Filter
      </button>
    </div>
  );
};

export default Sidebar; 