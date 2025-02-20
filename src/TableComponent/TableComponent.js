import React, { useState, useEffect } from 'react';
import { Table, Input, Select } from 'antd';
import columns from './columns';
import ExpandedRow from './ExpandedRow';
import styles from './TableComponent.module.css';

const { Option } = Select;

const TableComponent = ({ people, setPeople, onEdit, searchText, setSearchText, expandedRowKeys, setExpandedRowKeys }) => {
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [selectedCity, setSelectedCity] = useState("all");

  useEffect(() => {
    setFilteredPeople(people);
  }, [people]);

  // Получение списка уникальных городов
  const uniqueCities = [...new Set(people.map((p) => p.address?.city).filter(Boolean))];

  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedCity);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    filterData(searchText, city);
  };

  const filterData = (search, city) => {
    let filteredData = people;

    if (search) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (city && city !== "all") {
      filteredData = filteredData.filter((item) => item.address?.city === city);
    }

    setFilteredPeople(filteredData);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>
        <Input
          placeholder="Поиск..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Выберите город"
          onChange={handleCityChange}
          value={selectedCity}
          allowClear
          style={{ width: 200 }}
        >
          <Option value="all">Все города</Option>
          {uniqueCities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </div>

      <Table
        dataSource={filteredPeople.map((p, index) => ({ ...p, key: p.id || index }))}
        columns={columns(onEdit)}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <ExpandedRow record={record} />,
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys(expanded ? [...expandedRowKeys, record.key] : expandedRowKeys.filter((key) => key !== record.key));
          },
        }}
      />
    </>
  );
};

export default TableComponent;
