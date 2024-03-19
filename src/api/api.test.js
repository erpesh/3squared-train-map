import { fetchTrainScheduleData } from './api'; // Assuming './api' is the path to your file

jest.mock('fetch'); // Mock the fetch function

describe('fetchTrainScheduleData function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches train schedule data for provided IDs', async () => {
    const mockScheduleData = {};
    const activationId = 1234;
    const scheduleId = 5678;
    const expectedUrl = `https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${activationId}/${scheduleId}`;

    // Mock the fetch response
    fetch.mockResolvedValueOnce(
      Promise.resolve({
        json: jest.fn().mockResolvedValueOnce(mockScheduleData),
      })
    );

    const result = await fetchTrainScheduleData(activationId, scheduleId);

    // Expect fetch to be called with the correct URL
    expect(fetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        'X-ApiVersion': 1,
        'X-ApiKey': process.env.REACT_APP_API_KEY,
      },
    });

    expect(result).toEqual(mockScheduleData);
  });

  test('throws error on fetch failure', async () => {
    const error = new Error('Network error');
    fetch.mockRejectedValueOnce(error);

    expect.assertions(1); // Only one assertion needed

    try {
      await fetchTrainScheduleData(1234, 5678);
    } catch (err) {
      expect(err.message).toEqual('Error fetching train schedule.');
    }
  });
});
