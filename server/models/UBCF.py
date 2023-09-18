import pandas as pd
import numpy as np
import pymysql
import sys
import pymysql.cursors
from sklearn.metrics.pairwise import cosine_similarity

# mysql에서 db 불러오기
conn = pymysql.connect(
    user = 'user1',
    passwd = '12345678',
    host = '54.180.142.26',
    db = 'itemdb',
    charset = 'utf8',
    autocommit=True, 
    cursorclass=pymysql.cursors.DictCursor
)

cursor_like = conn.cursor()
cursor_item = conn.cursor()
cursor_collab = conn.cursor()

getlikedb = "select * from itemdb.likedb"
getitemdb = "select * from itemdb.itemdb"
getcollabdb = "select * from itemdb.collabdb"

cursor_like.execute(getlikedb)
cursor_item.execute(getitemdb)
cursor_collab.execute(getcollabdb)

likedb =cursor_like.fetchall()
itemdb =cursor_item.fetchall()
collabdb =cursor_collab.fetchall()


rating_matrix = pd.DataFrame(collabdb)
rm =rating_matrix.copy()
rating_matrix.set_index(keys='UID', inplace=True)


matrix_dummy = rating_matrix.copy().fillna(0)
user_similarity = cosine_similarity(matrix_dummy, matrix_dummy)
user_similarity = pd.DataFrame(user_similarity, index=rating_matrix.index, columns=rating_matrix.index)
#print(user_similarity) 



rating_mean = rating_matrix.mean(axis=1)    # 열 기준 평균(제품에 대한 사용자들의 평균)
rating_bias = (rating_matrix.T - rating_mean).T
#print(rating_bias)



rating_binary1 = np.array((rating_matrix > 0).astype(float))
rating_binary2 = rating_binary1.T
counts = np.dot(rating_binary1, rating_binary2)
counts = pd.DataFrame(counts, index=rating_matrix.index, columns=rating_matrix.index).fillna(0)
#print(counts)



def CF_knn_bias_sig(user_id, item_id, neighbor_size=0):
    if str(item_id) in rating_bias.columns:
        # 현 user와 다른 사용자 간의 유사도 가져오기
        sim_scores = user_similarity[user_id]
        # 현 movie의 평점편차 가져오기 (여기 코드 바뀜)
        item_ratings = rating_bias.iloc[:,item_id]   # ((((((이건 item_id가 열로 들어가도록, 리스트 형태로 받아옴))))))
        # 현 item에 대한 rating이 없는 사용자 표시
        no_rating = item_ratings.isnull()
        # 현 사용자와 다른 사용자간 공통 평가 아이템 수 가져오기 
        common_counts = counts[user_id]
        # 공통으로 평가한 제품의 수가 SIG_LEVEL보다 낮은 사용자 표시
        low_significance = common_counts < SIG_LEVEL
        # 평가를 안 하였거나, SIG_LEVEL이 기준 이하인 user 제거
        none_rating_idx = item_ratings[no_rating | low_significance].index
        item_ratings = item_ratings.drop(none_rating_idx)
        sim_scores = sim_scores.drop(none_rating_idx)
##### (2) Neighbor size가 지정되지 않은 경우        
        if neighbor_size == 0:
            # 편차로 예측값(편차 예측값) 계산
            prediction = np.dot(sim_scores, item_ratings) / sim_scores.sum()
            # 편차 예측값에 현 사용자의 평균 더하기
            prediction = prediction + rating_mean[user_id]
##### (3) Neighbor size가 지정된 경우            
        else:
            # 해당 영화를 평가한 사용자가 최소 MIN_RATINGS 이상인 경우에만 계산            
            if len(sim_scores) > MIN_RATINGS:
                # 지정된 neighbor size 값과 해당 영화를 평가한 총사용자 수 중 작은 것으로 결정
                neighbor_size = min(neighbor_size, len(sim_scores))
                # array로 바꾸기 (argsort를 사용하기 위함)
                sim_scores = np.array(sim_scores)
                movie_ratings = np.array(item_ratings)
                # 유사도를 순서대로 정렬
                user_idx = np.argsort(sim_scores)
                # 유사도와 rating을 neighbor size만큼 받기
                sim_scores = sim_scores[user_idx][-neighbor_size:]
                item_ratings = item_ratings[user_idx][-neighbor_size:]
                # 편차로 예측치 계산
                prediction = np.dot(sim_scores, item_ratings) / sim_scores.sum()
                # 예측값에 현 사용자의 평균 더하기
                prediction = prediction + rating_mean[user_id]
            else:
                prediction = rating_mean[user_id]
    else:
        prediction = rating_mean[user_id]
    return prediction

##### 최적의 값으로 재정의할 필요 있음 #####
SIG_LEVEL = counts.mean().mean()  #750
MIN_RATINGS = counts.min().mean()  # 공통 제품 개수의 임계치


print(rating_matrix.index)
print(rating_matrix.columns)
print(rating_matrix.loc[[2023052702],['1']])


recommend_list = pd.DataFrame(columns = ['UID', 'item', 'prediction'])
print("1: ", recommend_list)
for i in rating_matrix.index:
    for j in rating_matrix.columns:
        #if rating_matrix.loc[i][j]==0 :     # ser.iloc[pos]
        if rating_matrix.loc[[i],[j]].values == 0 :     
            pred = CF_knn_bias_sig(i, int(j), neighbor_size=0)
            #print("UID:", i, "item:" , int(j), "prediction:", pred)
            recommend = pd.DataFrame({'UID':[i], 'item' : [j], 'prediction': [pred]})
            recommend_list = pd.concat([recommend_list, recommend], ignore_index=True)
#print(recommend_list)

# 하나의 값만 확인
# CF_knn_bias_sig(2023052701, 0, neighbor_size=0)

# 전체 사용자 df) UID별로 예상평점이 높은 제품들부터 보여주기
recommend_list = recommend_list.sort_values(by=['UID', 'prediction'], ascending=[True, False], ignore_index=True)
#print(recommend_list)


# 특정 UID에게 추천할 상품 최종 순차목록
def UBCF(user_id):
    final_recommend = recommend_list[recommend_list['UID']==user_id]
    return final_recommend

def UBCF_Recommend(user_id):
    recommend = UBCF(user_id)
    recommend_num = 0
    if (round(len(recommend.columns)*0.05)<5):
        recommend_num = 5
    
    # print("recommend_num: ", recommend_num)
    top_recommend = recommend.head(recommend_num)
    recommend_item = top_recommend['item'].values
    print(recommend_item)
    return recommend_item

if __name__ == '__main__':
    UID = 2023052720
    UBCF_Recommend(UID)
    
    

### 평점이 높다고 예상되는 제품 추천
# 메모리 기반 CF 알고리즘은 
# 모든 사용자 간의 평점의 유사도를 계산하고 유사도에 따라 타겟 사용자가 평가하지 않은 모든 아이템에 대해 예상 평점을 구한다. 
# 예상 평점은 다른 유사 사용자의 해당 아이템에 대한 평점을 타겟 사용자와의 유사도로 가중 평균해서 구한다. 
# 아이템 중에서 가장 높은 평점의 N개의 아이템을 추천한다.



# ### 성능 평가

# # RMSE 함수
# def RMSE(y_true, y_pred):
#     return np.sqrt(np.mean((np.array(y_true)-np.array(y_pred))**2))

# # score(RMSE) 계산
# def score(model):
#     id_pairs = zip(x_test['user_id'], x_test['movie_id'])
#     y_pred = np.array([model(user, movie) for (user,movie) in id_pairs])
#     y_true = np.array(x_test['rating'])
#     return RMSE(y_true, y_pred)
    
# ### 데이터셋 만들기
# x = ratings.copy()
# y = ratings['user_id']

# x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.25, stratify = y)
# ratings_matrix = x_train.pivot(index='user_id', columns = 'movie_id',values = 'rating')