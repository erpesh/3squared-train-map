import { fetchTrains } from './index'; // Assuming './api' is the path to your file

jest.mock('fetch'); // Mock the fetch function

describe('fetchTrains function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches trains for provided stations', async () => {
    const mockTrainData = [
      { trainId: 123, lastReportedType: 'DEPARTURE' },
      { trainId: 456, lastReportedType: 'ARRIVAL' },
    ];
    const stations = ['LEEDS', 'SHEFFIELD'];
    const expectedUrl = `https://traindata-stag-api.railsmart.io/api/trains/tiploc/${stations.join(',')}/${new Date().toISOString().split('T')[0]}T00:00:00/${new Date().toISOString().split('T')[0]}T23:59:59`;

    // Mock the fetch response
    fetch.mockResolvedValueOnce(
      Promise.resolve({
        json: jest.fn().mockResolvedValueOnce(mockTrainData),
      })
    );

    const result = await fetchTrains(stations);

    // Expect fetch to be called with the correct URL
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        'X-ApiVersion': 1,
        'X-ApiKey': process.env.REACT_APP_API_KEY,
      },
    });

    // Expect filtered data to contain only departures and arrivals
    expect(result).toEqual(expect.arrayContaining(mockTrainData));

    // Expect duplicates to be removed
    expect(result.length).toBe(mockTrainData.length); // Adjust if duplicates expected
  });

  test('fetches default stations if none provided', async () => {
    const mockTrainData = [{ trainId: 789 }];

    // Mock the fetch response
    fetch.mockResolvedValueOnce(
      Promise.resolve({
        json: jest.fn().mockResolvedValueOnce(mockTrainData),
      })
    );

    const result = await fetchTrains();
    // Expect default stations to be used in URL
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('LEEDS'));

    expect(result).toEqual(expect.arrayContaining(mockTrainData));
  });

  test('throws error on fetch failure', async () => {
    const error = new Error('Network error');
    fetch.mockRejectedValueOnce(error);

    expect.assertions(1); // Only one assertion needed

    try {
      await fetchTrains();
    } catch (err) {
      expect(err.message).toEqual('Error fetching trains.');
    }
  });
});
