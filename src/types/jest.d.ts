declare global {
  var jest: {
    fn: () => jest.Mock;
  };
  
  namespace jest {
    interface Mock {
      mockResolvedValue: (value: any) => Mock;
      mockRejectedValue: (value: any) => Mock;
      mockReturnValue: (value: any) => Mock;
      mockClear: () => void;
    }
  }
}