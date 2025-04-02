document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('musicRequestForm');
    const requestList = document.getElementById('requestList');
    const sortToggle = document.getElementById('sortToggle');
    const sortIcon = document.getElementById('sortIcon');
    let isAscending = true; // 기본값은 오름차순
    let currentHighlightIndex = 0; // 현재 강조되는 인덱스
    let highlightInterval; // 강조 효과를 위한 인터벌 ID

    // 로딩 상태 관리
    function showLoading() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loadingOverlay.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-4 text-gray-700">처리 중...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }

    function hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    // 날짜 포맷팅 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    // 정렬 아이콘 업데이트
    function updateSortIcon() {
        sortIcon.style.transform = isAscending ? 'rotate(0deg)' : 'rotate(180deg)';
        sortToggle.querySelector('span').textContent = isAscending ? '정렬 ↑' : '정렬 ↓';
    }

    // 강조 효과 시작 함수
    function startHighlightAnimation(totalRequests) {
        // 기존 인터벌 제거
        if (highlightInterval) {
            clearInterval(highlightInterval);
        }

        // 강조 효과 초기화
        currentHighlightIndex = 0;

        // 2초마다 다음 항목 강조
        highlightInterval = setInterval(() => {
            // 이전 강조 효과 제거
            const prevHighlight = document.querySelector('.highlight-animation');
            if (prevHighlight) {
                prevHighlight.classList.remove('highlight-animation');
            }

            // 현재 항목 강조
            const items = document.querySelectorAll('.request-item');
            if (items.length > 0) {
                items[currentHighlightIndex].classList.add('highlight-animation');
                
                // 다음 인덱스로 이동
                currentHighlightIndex = (currentHighlightIndex + 1) % items.length;
            }
        }, 2000);
    }

    // 신청 목록 불러오기
    async function loadRequests() {
        try {
            const response = await axios.get('/api/requests');
            let requests = response.data;
            
            // 정렬 적용
            requests.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
            
            requestList.innerHTML = requests.map((request, index) => `
                <div class="request-item border rounded-lg p-4 hover:bg-gray-50 transition-all duration-300">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-500">${isAscending ? index + 1 : requests.length - index}</span>
                            <h3 class="font-semibold">${request.title}</h3>
                            <span class="text-sm text-gray-500">-</span>
                            <span class="text-sm text-gray-500">${request.artist}</span>
                        </div>
                        <span class="text-xs text-gray-400 mt-1 lg:mt-0">${formatDate(request.createdAt)}</span>
                    </div>
                    <p class="text-gray-600 text-sm">${request.reason}</p>
                </div>
            `).join('');

            // 애니메이션 시작
            startHighlightAnimation(requests.length);

            // 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
                @keyframes highlightFade {
                    0% { 
                        background: linear-gradient(30deg, #FFFFFF 0%, #FFD8EF 33%, #FFEBD9 66%, #FFFFFF 100%);
                        background-size: 400% 400%;
                        background-position: 0% 50%;
                        transform: scale(1);
                    }
                    30% { 
                        background: linear-gradient(30deg, #FFFFFF 0%, #FFD8EF 33%, #FFEBD9 66%, #FFFFFF 100%);
                        background-size: 400% 400%;
                        background-position: 50% 50%;
                        transform: scale(1.02);
                    }
                    40% { 
                        background: linear-gradient(30deg, #FFFFFF 0%, #FFD8EF 33%, #FFEBD9 66%, #FFFFFF 100%);
                        background-size: 400% 400%;
                        background-position: 50% 50%;
                        transform: scale(1.02);
                    }
                    100% { 
                        background: linear-gradient(30deg, #FFFFFF 0%, #FFD8EF 33%, #FFEBD9 66%, #FFFFFF 100%);
                        background-size: 400% 400%;
                        background-position: 100% 50%;
                        transform: scale(1);
                    }
                }
                .highlight-animation {
                    animation: highlightFade 2s ease-in-out;
                    transform-origin: center;
                }
            `;
            document.head.appendChild(style);

        } catch (error) {
            console.error('신청 목록을 불러오는데 실패했습니다:', error);
        }
    }

    // 정렬 토글 이벤트 처리
    sortToggle.addEventListener('click', () => {
        isAscending = !isAscending;
        updateSortIcon();
        loadRequests();
    });

    // 폼 제출 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            artist: document.getElementById('artist').value,
            reason: document.getElementById('reason').value
        };

        try {
            const response = await axios.post('/api/requests', formData);
            
            if (response.status === 201) {
                form.reset();
                loadRequests();
            } else {
                throw new Error('신청에 실패했습니다.');
            }
        } catch (error) {
            console.error('신청 중 오류가 발생했습니다:', error);
            alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });

    // 데이터베이스 초기화 관련 코드
    const hiddenResetButton = document.getElementById('hiddenResetButton');
    const resetModal = document.getElementById('resetModal');
    const resetConfirmation = document.getElementById('resetConfirmation');
    const cancelReset = document.getElementById('cancelReset');
    const confirmReset = document.getElementById('confirmReset');

    // 숨겨진 버튼 클릭 시 모달 표시
    hiddenResetButton.addEventListener('click', () => {
        resetModal.classList.remove('hidden');
        resetModal.classList.add('flex');
    });

    // 취소 버튼 클릭 시 모달 닫기
    cancelReset.addEventListener('click', () => {
        resetModal.classList.add('hidden');
        resetModal.classList.remove('flex');
        resetConfirmation.value = '';
    });

    // 초기화 확인 버튼 클릭 시
    confirmReset.addEventListener('click', async () => {
        if (resetConfirmation.value !== '초기화하겠습니다') {
            alert('정확히 "초기화하겠습니다"를 입력해주세요.');
            return;
        }

        try {
            showLoading();
            const response = await axios.post('/api/requests/reset');
            alert(response.data.message);
            loadRequests(); // 목록 새로고침
        } catch (error) {
            console.error('데이터베이스 초기화 실패:', error);
            alert('데이터베이스 초기화에 실패했습니다.');
        } finally {
            hideLoading();
            resetModal.classList.add('hidden');
            resetModal.classList.remove('flex');
            resetConfirmation.value = '';
        }
    });

    // 초기 로드
    loadRequests();
}); 