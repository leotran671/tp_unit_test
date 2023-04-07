const postmodel = require("../models/postModel");
const commentmodel = require("../models/commentModel");
const commentcontroller = require("../controllers/commentController");

jest.mock("../models/commentModel");
jest.mock("../models/postModel");

describe("commentController", () => {
  describe("getAllcomments", () => {
    it("should return all comments", async () => {
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      const comments = [{ _id: "1", names: "John", content: "Comment 1" }, { _id: "2", names: "Doe", content: "Comment 2" },];

      commentmodel.find = jest.fn().mockImplementationOnce((query, callback) => {
        callback(null, comments);
      });

      await commentcontroller.getAllcomments(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(comments);
    });

    it("should handle errors", async () => {
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      commentmodel.find = jest.fn().mockImplementationOnce((query, callback) => {
        callback("Database error", null);
      });

      await commentcontroller.getAllcomments(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getcomments", () => {
    it("should return comments for a specific post", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      const comments = [{ _id: "1", names: "John", content: "Comment 1" }, { _id: "2", names: "Jane", content: "Comment 2" },];

      commentmodel.find = jest.fn().mockImplementationOnce((query, callback) => {
        callback(null, comments);
      });

      await commentcontroller.getcomments(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(comments);
    });

    it("should handle errors", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      commentmodel.find = jest.fn().mockImplementationOnce((query, callback) => {
        callback("Database error", null);
      });

      await commentcontroller.getcomments(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("createcomment", () => {
    it("should create a new comment", async () => {
      const req = {
        params: { id: "2" },
        body: { names: "John", content: "New comment" },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      const post = { _id: "1" };

      postmodel.findById = jest.fn().mockImplementationOnce((query, callback) => {
        callback(null, post);
      });

      const save = jest.fn().mockImplementationOnce((callback) => {
        callback(null, req.body);
      });

      jest.spyOn(commentmodel.prototype, "save").mockImplementationOnce(save);

      await commentcontroller.createcomment(req, res);

      expect(postmodel.findById).toHaveBeenCalledWith(req.params.id, expect.any(Function));
      expect(commentmodel.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });
});

describe('commentController', () => {
  describe('updatecomments', () => {
    it('should return status code 200 and updated comment object on successful update', async () => {
      const mockReq = { params: { id: '1' }, body: { content: 'updated content' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockComment = { _id: '1', names: 'Test Name', content: 'original content' };

      jest.spyOn(commentmodel, 'findByIdAndUpdate').mockImplementationOnce((id, update, callback) => {
        callback(null, mockComment);
      });

      await commentcontroller.updatecomments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return status code 401 and error message on unsuccessful update', async () => {
      const mockReq = { params: { id: '1' }, body: { content: 'updated content' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockError = 'Update error';

      jest.spyOn(commentmodel, 'findByIdAndUpdate').mockImplementationOnce((id, update, callback) => {
        callback(mockError, null);
      });

      await commentcontroller.updatecomments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError });
    });
  });

  describe('deletecomments', () => {
    it('should return status code 200 and deleted comment object on successful delete', async () => {
      const mockReq = {};
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockComment = { _id: '1', names: 'Test Name', content: 'original content' };

      jest.spyOn(commentmodel, 'deleteMany').mockImplementationOnce((query, callback) => {
        callback(null, mockComment);
      });

      await commentcontroller.deletecomments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockComment);
    });

    it('should return status code 401 and error message on unsuccessful delete', async () => {
      const mockReq = {};
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockError = 'Delete error';

      jest.spyOn(commentmodel, 'deleteMany').mockImplementationOnce((query, callback) => {
        callback(mockError, null);
      });

      await commentcontroller.deletecomments(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: mockError });
    });
  });

  describe('getcomment', () => {
    it('should return status code 200 and comment object on successful find', async () => {
      const mockReq = { params: { id: '1' } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockComment = { _id: '1', names: 'Test Name', content: 'original content' };

      jest.spyOn(commentmodel, 'findById').mockImplementationOnce((id, callback) => {
        callback(null, mockComment);
      });
    });
  });
});


