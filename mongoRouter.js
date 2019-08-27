var express = require('express');
const hasher = require('pbkdf2-password')();
const Users = require('../schemas/user');
const Items = require('../schemas/item');

module.exports = () => {
    var router = express.Router();
    router.get('/', (req, res) => {
        res.send('mongodb router');
    })

    // 신규 유저 생성
    // userid | password | salt | name | email
    router.post('/signup', (req, res) => {
        // req.body 객체에서 바로 hasher로
        hasher({
            password: req.body.password
        }, (err, pass, salt, hash) => {
            if (err) {
                console.log('ERR: ', err);
                res.status(500).redirect('/');
                return;
            }

            // user 콜렉션에 hash 저장
            const user = new Users({
                userid: req.body.userid,
                password: hash,
                salt: salt,
                name: req.body.name,
                email: req.body.email,
            });

            user.save((err, result) => {
                if (err) console.log(err);
                else {
                    console.log(result);
                    res.redirect('/');
                }
            });

        });
    });

    // 로그인 요청
    router.post('/login', (req, res) => {
        console.log(req.body);
        let userid = req.body.userid;
        let password = req.body.password;

        console.log(userid);
        Users.findOne({ userid }, (err, user) => {
            if (err) {
                console.log(err)
                return;
            }
            if (user === null) {
                console.log("사용자 없음");
                return res.status(401).json({ result: false });;
            }

            hasher({
                password: password,
                salt: user.salt
            }, (err, pass, salt, hash) => {
                console.log('hash : ', hash);
                console.log('pass : ', user.password);

                if (hash === user.password) {
                    console.log('로그인 성공');
                    req.session.user = user;
                    res.cookie("id", user.userid, { maxAge: 10 * 60 * 60 * 1000, httpOnly: true });
                    res.cookie("name", user.name, { maxAge: 10 * 60 * 60 * 1000, httpOnly: true });
                    res.cookie("isLoggedIn", true, { maxAge: 10 * 60 * 60 * 1000 });
                    res.json({ result: true, name: user.name, id: user._id });
                } else {
                    console.log('패스워드가 맞지 않습니다');
                    res.redirect('/');
                }
            });
        });
    });

    router.get('/testCookie', (req, res) => {
        if (res.locals.user) {
            return res.json(true);
        }
        else
            return res.json(false);
    })

    // 마이페이지 > 정보 수정 요청
    router.get('/userinfo', (req, res) => {
        let user = res.locals.user;
        // console.log(userid);
        if (!user)
            return res.status(401).json({ error: "Session not exist" });

        let userid = user.userid;
        Users.findOne({ userid }, (err, result) => {
            if (err)
                return res.json(err);

            res.json(result);
        });
    });


    // 마이페이지 > 관심 상품
    router.get('/wishlist', (req, res) => {
        let user = res.locals.user;
        if (!user)
            return res.status(401).json({ error: "Session not exist" });

        let userid = user.userid;
        Users.findOne({ userid }, { _id: 0, createdAt: 1 }, (err, result) => {
            res.json(result);
        })
    });

    router.get('/testArray', (req, res) => {
        let test = [{ "_id": "5d4368d73ecfd3cb625cb461", "category": "소세지", "name": "맛있닭 닭가슴살소시지 훈제", "imgUrl": "https://file.rankingdak.com/_data/item/1421823810_l1.jpg", "kcal": 135, "carbo": 3, "protein": 23, "fat": 4, "sFat": 0.7, "tFat": 0, "sugar": 2, "choles": 65, "natrium": 250, "ingredi": "닭고기(가슴살 국내산 79.52 %, 대두유{대두유(외국산 아르헨티나, 미국, 브라질 등), d-토코페놀 (혼합형), 규소수지}, 전란액(계란 100 %/국내산), 알콘에스비, 복합시즈닝SD, 복합믹스-J, 함수 포도당, 비프젤라틴, 산도조절제, 육풍미시즈닝, 기타소금, 비타민C, 스모크오일[히코리스모크오일RS(미국산/대두유, 스모크 향), 대두유(대두, 규소수지)] 007%, 생강분말, 콜라겐케이싱" }, { "_id": "5d4368d73ecfd3cb625cb462", "category": "소세지", "name": "맛있닭 닭가슴살소시지 현미", "imgUrl": "https://file.rankingdak.com/_data/item/1421825042_l1.jpg", "kcal": 145, "carbo": 6, "protein": 20, "fat": 4.5, "sFat": 0.9, "tFat": 0, "sugar": 1, "choles": 85, "natrium": 200, "ingredi": "닭고기(가슴살/국내산) 76.18 %, 전란액(계란 100 %/국내산), 대두유{대두유(외국산:아르헨티나, 미국, 브라질 등), d-토코페놀(혼합형), 규소수지}, 현미가루(현미100%/국내산) 3.95 %, 알콘에스비, 복합시즈닝SD, 복합믹스-J, 함수포도 당, 비프젤라틴, 산도조절제, 육풍미시즈닝, 기타소금, 비타민C, 생강분말, 파슬리분태, 콜라겐케이싱" }, { "_id": "5d4368d73ecfd3cb625cb463", "category": "소세지", "name": "맛있닭 닭가슴살소시지 할라피뇨", "imgUrl": "https://file.rankingdak.com/_data/item/1479965640_l1.jpg", "kcal": 130, "carbo": 3, "protein": 20, "fat": 4.1, "sFat": 0.9, "tFat": 0, "sugar": 1, "choles": 55, "natrium": 250, "ingredi": "닭고기(가슴살/국내산) 72.3 %, 슬라이스 할라피뇨 피클[할라피뇨 고추 60 %, 식초, 정제소금, 향신료(후추, 월계수, 오레가노)](멕시코산) 8.25 %, 전란액(계란 100%/국내산), 대두유, 알콘에스비, 복합시즈닝SD, 복합믹스-J, 함수포도당, 비프젤라틴, 산도조절제, 육풍미시즈닝, 기타소금, 청양초맛 분말, 비타민C, 생강분말, 콜라겐케이싱" }, { "_id": "5d4368d73ecfd3cb625cb464", "category": "소세지", "name": "맛있닭 닭가슴살소시지 견과", "imgUrl": "https://file.rankingdak.com/_data/item/1479966049_l1.jpg", "kcal": 150, "carbo": 5, "protein": 21, "fat": 5, "sFat": 1, "tFat": 0, "sugar": 1, "choles": 55, "natrium": 210, "ingredi": "닭고기(가슴살/국내산) 75.06 %, 전란액(계란 100% 국내산), 대두유{대두유(외국산 아르헨티나, 미국, 브라질 등) d-토코페놀(혼합형), 규소수지}, 알콘에스비, 복합시즈닝SD, 황토가마에 구운 해바라기씨(미국산) 1.33 %, 황토가마에 구운 호두(미국산) 1.33 % 황토가마에 구운 아몬드(미국산) 1.33 %, 복합믹스-J, 함수포도당, 비프젤라틴, 산도조절제, 육풍미시즈닝, 기타 소금, 비타민C 생강분말, 콜라겐케이싱" }, { "_id": "5d4368d73ecfd3cb625cb465", "category": "소세지", "name": "더프레시 오징어 비엔나 닭가슴살 소시지", "imgUrl": "https://file.rankingdak.com/_data/item/a87fa5c44ed1bf05f99749659eb61443.jpg", "kcal": 125.25, "carbo": 8.02, "protein": 18.37, "fat": 2, "sFat": 0.67, "tFat": 0, "sugar": 2.34, "choles": 67.47, "natrium": 166.33, "ingredi": "닭가슴살(국내산)73.3%,양파(국내산), 오징어 (연근해산)3.5%, 함수포도당,탈지대두, 농축대두단백,유장분말, 건빵가루 HS솔루션시즈닝, 새우조미시즈닝-1, 콜라겐케이싱,미담다시마장,카라기난, 폴리인산나트륨(산도조절제),흑후추 분말,코트롤티에이치(산도조절제)" }];
        res.json(test);
    });

    router.get('/detail/:id', (req, res) => {
        console.log(req.params.id);
        _id = req.params.id;

        Items.findOne({ _id }, (err, result) => {
            res.status(200).json(result);
        })
    })

    // id포함 전체 아이템 리스트 받기
    router.get('/itemlist', (req, res) => {
        // req.setTimeout(0); // 504에러 방지
        // Item
        console.log('요청옴');
        Items.find({}, {
            // _id: 0,
            // category: 1,
            // name: 1,
            // imgUrl: 1,
            // kcal: 1,
            // carbo: 1,
            // protein: 1,
            // fat: 1,
            // sFat: 1,
            // tFat: 1,
            // sugar: 1,
            // choles: 1,
            // natrium: 1,
            // ingredi: 1
        }, (err, results) => {
            res.json(results);
        })
    });

    router.get('/search/:value', (req, res) => {
        const searchVal = req.params.value;
        console.log("search: ", searchVal);
        Items.find({ $text: { $search: searchVal } }, (err, result) => {
            console.log(result);
            res.json(result);
        });
    });

    router.get('/searchCategory/:category/:value', (req, res) => {
        const searchVal = req.params.value;
        const category = req.params.category;

        console.log("search: ", searchVal);
        Items.find({ category, $text: { $search: searchVal } }, (err, result) => {
            console.log(result);
            res.json(result);
        });
    });



    // router.put('/user/update/:id', (req, res, next) => {
    //     const _id = req.params.id;
    //     Users.deleteOne({ _id }, (err, result) => {
    //         console.log(result);
    //         req.session.destroy(() => {
    //             req.session;
    //             delete res.locals.user;
    //         });
    //         res.status(200).redirect('/');
    //     });
    // })

    // })



    
    router.delete('/user/delete/:id', (req, res, next) => {
        const _id = req.params.id;
        Users.deleteOne({ _id }, (err, result) => {
            console.log(result);
            req.session.destroy(() => {
                req.session;
                delete res.locals.user;
            });
            res.status(200).redirect('/');
        });
    })

    return router;
}
