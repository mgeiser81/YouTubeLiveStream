import { StreamLabsYouTubePage } from './app.po';

describe('stream-labs-you-tube App', () => {
  let page: StreamLabsYouTubePage;

  beforeEach(() => {
    page = new StreamLabsYouTubePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
