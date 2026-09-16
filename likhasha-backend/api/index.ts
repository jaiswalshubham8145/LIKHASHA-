import app from '../src/app';

const handler = (req: any, res: any) => {
  return (app as any)(req, res);
};

(handler as any).app = app;

module.exports = handler;
export default handler;

