var responderSet = require('../config/_responderSet');
var resultStatus = responderSet.checkResult;

module.exports = {
    getUserInfo: function (pool, callback) {// not in use
        pool.query("SELECT * FROM `tn_student_list` ORDER BY `sl_roll_number`  LIMIT 20", [], function (err, result) {
            if (err) {
                sendData._call = 0,
                    sendData._error = err
            } else {
                sendData._call = 1,
                    sendData._data = result
            }
            callback(sendData);
        });
    },
    verifyLink: function (pool, link, callback) {
        pool.query("SELECT * FROM tm_publish_test_list WHERE ptl_link_1 = ?", [link], function (err, result) {
            if (err) {
                responderSet.sendData._call = 0,
                    responderSet.sendData._error = err
                callback(responderSet.sendData, true);
            } else {
                callback(resultStatus.checkResultForNullData(result), false);
            }
        })
    },
    getStudentVerifyForExam: function (pool, student_details, callback) {
        var query = "SELECT * FROM  tn_student_list  WHERE sl_roll_number = ? AND sl_mobile_number_parents = ?";
        var query_data = [student_details.r_no, student_details.m_no];
        pool.query(query, query_data, function (err, result) {
            if (err) {
                responderSet.sendData._call = 0,
                    responderSet.sendData._error = err
                callback(responderSet.sendData, true);
            } else {
                callback(resultStatus.checkResultForNullData(result), false);
            }
        });
    },
    createStudentQuestionPaper: function (pool, exam_details, callback) {

        var _this = this;
        pool.beginTransaction(function (err) {
            if (err) {
                responderSet.sendData._call = 0,
                    responderSet.sendData._error = err
                callback(responderSet.sendData, true);
            }
            _this._getTestDataSet(pool, exam_details, function (db_data, is_error) {

                if (is_error) {
                    pool.rollback(function () {
                        responderSet.sendData._call = 0,
                            responderSet.sendData._error = err
                        callback(responderSet.sendData, true);
                    });
                } else {
                    _this._insertStudentTestPaper(pool, db_data, exam_details, function (is_details_added, is_error, e_details) {
                        if (is_error) {
                            pool.rollback(function () {
                                responderSet.sendData._call = 0;
                                responderSet.sendData._error = is_details_added;
                                callback(responderSet.sendData, true);
                            });// rollback
                        } else {
                            if (is_details_added.affectedRows <= 0) {
                                pool.rollback(function () {
                                    responderSet.sendData._call = 0;
                                    responderSet.sendData._error = 'Not a string record inserted';
                                    callback(responderSet.sendData, true);
                                });// rollback
                            } else {
                                _this._insertStudentToPaper(pool, e_details, function (student_to_test, is_error) {
                                    if (is_error) {
                                        pool.rollback(function () {
                                            responderSet.sendData._call = 0;
                                            responderSet.sendData._error = 'Unable to add student';
                                            callback(responderSet.sendData, true);
                                        });// rollback
                                    } else {
                                        pool.commit(function (err) {
                                            if (err) {
                                                pool.rollback(function () {
                                                    responderSet.sendData._call = 0;
                                                    responderSet.sendData._error = err;
                                                    callback(responderSet.sendData, true);
                                                });
                                            } else {
                                                pool.end();
                                                responderSet.sendData._call = 1;
                                                callback(responderSet.sendData, true);
                                            }
                                        });
                                    }
                                })
                            }
                        }
                    });// _insertStudentTestPaper(){}
                }
            });// _getTestDataSet(){}
        })// pool.beginTransaction(){}
    },
    _getTestDataSet: function (pool, exam_details, callback) {
        var query = "SELECT question_set.q_id, " +
            " IFNULL(" + exam_details.student_id + "," + exam_details.student_id + ") as sqp_student_id," +
            " IFNULL(" + exam_details.publish_id + "," + exam_details.publish_id + ") as sqp_publish_id," +
            " IFNULL(" + exam_details.test_id + "," + exam_details.test_id + ") as test_id" +
            " FROM tm_test_question_sets as question_set WHERE tqs_test_id = ?  LIMIT ?";
        // callback(query);
        console.log('_getTestDataSet');
        var query_data = [exam_details.test_id, exam_details.test_question_limit];
        pool.query(query, query_data, function (err, result) {
            if (err) {
                callback(err, true)
            } else {
                callback(result, false);
            }
        });
    },
    _insertStudentTestPaper: function (pool, db_data, exam_details, callback) {
        console.log('_insertStudentTestPaper');
        if (db_data.length > 0) {
            var insert_array = [];
            var query = "INSERT INTO tm_student_question_paper (sqp_question_id, sqp_student_id, sqp_publish_id, sqp_test_id) VALUES ?";
            db_data.forEach(function (value, index, main_array) {
                insert_array.push([value.q_id, value.sqp_student_id, value.sqp_publish_id, value.test_id])
            });
            pool.query(query, [insert_array], function (err, result) {
                if (err) {
                    callback(err, true, {});
                } else {
                    callback(result, false, exam_details);
                }
            })
        } else {
            callback(false);
        }
    },
    _insertStudentToPaper: function (pool, exam_details, callback) {
        console.log('_insertStudentToPaper');
        var query = "INSERT INTO tm_student_test_lis (stl_test_id, stl_stud_id, stl_publish_id) VALUES ?";
        pool.query(query,
            [[[exam_details.test_id, exam_details.student_id, exam_details.publish_id]]],
            function (err, db_result) {
                if (err)
                    callback(err, true);
                else {
                    callback(db_result, false)
                }
            });
    }



}

