class ScoresController < ApplicationController
  # POST /scores
  # POST /scores.json
  def index
    @scores = Score.all.order('score_count DESC')
  end

  def create
    @score = Score.new(score_params)

    respond_to do |format|
      if @score.save
        format.html { redirect_to scores_path, notice: 'Your score has been successfully save in the leader board.' }
        format.json {
          render json: {
            location: scores_path,
            flash: { notice: 'Your score has been successfully save in the leader board.'}
          }
        }
      end
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def score_params
      params.require(:score).permit(:score_count, :name)
    end
end
