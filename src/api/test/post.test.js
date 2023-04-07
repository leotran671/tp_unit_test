const modelePublication = require("../models/postModel");
const controleurPublication = require("../controllers/postController");

jest.mock("../models/postModel");

describe("controleurPublication", () => {
  describe("getAllPost", () => {
    it("should return all post", async () => {
      const requete = {};
      const reponse = {
        status: jest.fn(() => reponse),
        json: jest.fn(),
      };

      const commentaires = [{ _id: "1", title: "John", des: "Comment 1" }, { _id: "2", title: "Doe", des: "Comment 2" },];

      modelePublication.find = jest.fn().mockImplementationOnce((query, callback) => {
        callback(null, commentaires);
      });

      await controleurPublication.getPosts(requete, reponse);

      expect(reponse.status).toHaveBeenCalledWith(200);
      expect(reponse.json).toHaveBeenCalledWith(commentaires);
    });
  });

  describe('controleurPublication', () => {
    describe('updatecomments', () => {
      it('should return status code 200 and updated comment object on successful update', async () => {
        const requeteMock = { params: { id: '1' }, body: { des: 'updated des' } };
        const reponseMock = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const commentaireMock = { _id: '1', title: 'Test Name', des: 'original des' };

        jest.spyOn(modelePublication, 'findByIdAndUpdate').mockImplementationOnce((id, update, callback) => {
          callback(null, commentaireMock);
        });

        await controleurPublication.updatePosts(requeteMock, reponseMock);

        expect(reponseMock.status).toHaveBeenCalledWith(200);
        expect(reponseMock.json).toHaveBeenCalledWith(commentaireMock);
      });
    });

    describe('deletecomments', () => {
      it('should return status code 200 and deleted comment object on successful delete', async () => {
        const requeteMock = {};
        const reponseMock = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const commentaireMock = { _id: '1', title: 'Test Name', des: 'original des' };

        jest.spyOn(modelePublication, 'deleteMany').mockImplementationOnce((query, callback) => {
          callback(null, commentaireMock);
        });

        await controleurPublication.deletePosts(requeteMock, reponseMock);

        expect(reponseMock.status).toHaveBeenCalledWith(200);
        expect(reponseMock.json).toHaveBeenCalledWith(commentaireMock);
      });
    });

    describe('getcomment', () => {
      it('should return status code 200 and comment object on successful find', async () => {
        const requeteMock = { params: { id: '1' } };
        const reponseMock = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const commentaireMock = { _id: '1', title: 'Test Name', des: 'original des' };

        jest.spyOn(modelePublication, 'findById').mockImplementationOnce((id, callback) => {
          callback(null, commentaireMock);
        });
      });
    });
  });

  describe('getPost', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('should get the post with the specified id', async () => {
      const requete = { params: { id: '1' } };
      const reponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const publication = { _id: '1', title: 'Test Post', des: 'Test Description', date: expect.any(Date) };
      modelePublication.findById.mockImplementationOnce((postId, callback) => {
        expect(postId).toEqual(requete.params.id);
        callback(null, publication);
      });
      const getPostResult = controleurPublication.getPost(requete, reponse);
      expect(modelePublication.findById).toHaveBeenCalledTimes(1);
      expect(reponse.status).toHaveBeenCalledTimes(1);
      expect(reponse.status).toHaveBeenCalledWith(200);
      expect(reponse.json).toHaveBeenCalledTimes(1);
      expect(reponse.json).toHaveBeenCalledWith(publication);
      expect(getPostResult).toEqual(undefined);
    });

    it('should handle error when getting post', async () => {
      const requete = { params: { id: '1' } };
      const reponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const erreur = new Error('Error getting post');
      modelePublication.findById.mockImplementationOnce((postId, callback) => {
        expect(postId).toEqual(requete.params.id);
        callback(erreur);
      });
      const getPostResult = controleurPublication.getPost(requete, reponse);
      expect(modelePublication.findById).toHaveBeenCalledTimes(1);
      expect(reponse.status).toHaveBeenCalledTimes(1);
      expect(reponse.status).toHaveBeenCalledWith(401);
      expect(reponse.json).toHaveBeenCalledTimes(1);
      expect(reponse.json).toHaveBeenCalledWith({ message: erreur });
      expect(getPostResult).toEqual(undefined);
    });
  })
});
