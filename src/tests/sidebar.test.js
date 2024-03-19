import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Sidebar from '../sidebar/Sidebar';


describe('Sidebar component', () => {
  // Mocking the useAppState hook
  jest.mock('../AppContext', () => ({
    useAppState: () => ({
      trains: [
        { trainId: 1, originLocation: 'Station A', destinationLocation: 'Station B', scheduledDeparture: '10:00', scheduledArrival: '12:00', isLate: false },
        { trainId: 2, originLocation: 'Station B', destinationLocation: 'Station C', scheduledDeparture: '11:00', scheduledArrival: '13:00', isLate: true, delayInMinutes: 30 }
      ],
      filteredTrains: [
        { trainId: 1, originLocation: 'Station A', destinationLocation: 'Station B', scheduledDeparture: '10:00', scheduledArrival: '12:00', isLate: false },
        { trainId: 2, originLocation: 'Station B', destinationLocation: 'Station C', scheduledDeparture: '11:00', scheduledArrival: '13:00', isLate: true, delayInMinutes: 30 }
      ],
      filters: {},
      setFilters: jest.fn(),
      selectedTrain: null,
      setSelectedTrain: jest.fn(),
      loading: false
    })
  }));

  it('renders train information correctly', () => {
    render(<Sidebar />);
    expect(screen.getByText('Train Information')).toBeInTheDocument();
    expect(screen.getByText('Trains from')).toBeInTheDocument();
    expect(screen.getByText('Trains to')).toBeInTheDocument();
    expect(screen.getAllByTestId('train-card')).toHaveLength(2);
  });

  it('renders skeleton loader when loading', () => {
    render(<Sidebar />);
    expect(screen.queryAllByTestId('skeleton-loader')).toHaveLength(0);
    // Simulate loading
    jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()]);
    render(<Sidebar />);
    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(5);
  });

  it('applies filters correctly', () => {
    render(<Sidebar />);
    fireEvent.change(screen.getByLabelText('Trains from'), { target: { value: 'Station A' } });
    expect(screen.getAllByTestId('train-card')).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Trains to'), { target: { value: 'Station C' } });
    expect(screen.getAllByTestId('train-card')).toHaveLength(1);
  });

  it('expands sidebar on train card click', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getAllByTestId('train-card')[0]);
    expect(screen.getByText('ExpandSidebar content')).toBeInTheDocument(); // Assuming there's some content in the expanded sidebar
  });
});
